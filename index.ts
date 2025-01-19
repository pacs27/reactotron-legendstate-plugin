
  import { Reactotron, Command, PluginConfig, Store, StateChange } from "./types";
  
  module.exports = (pluginConfig: PluginConfig) => (reactotron: Reactotron) => {
    // Initialize Reactotron properties
    reactotron.unsubscriptions = [];
    reactotron.stores = initializeStores(pluginConfig?.stores || []);
  
    let stateChanges: StateChange[] = [];
    let activeSubscriptions: string[] = [];
  
    function initializeStores(stores: Store[]): Store[] {
      return stores.map((store) => ({
        ...store,
        observable: store.observable,
      }));
    }
  
    function resetStores(): void {
      reactotron.stores = initializeStores(pluginConfig?.stores || []);
    }
  
    function unsubscribeFromStores(): void {
      reactotron.unsubscriptions.forEach((unsubscribe) => unsubscribe());
      reactotron.unsubscriptions = [];
    }
  
    function trackStateChange(storeName: string, newState: any): StateChange[] {
      if (!reactotron) return [];
  
      const existingChangeIndex = stateChanges.findIndex(
        (change) => change.path === storeName
      );
  
      if (existingChangeIndex > -1) {
        stateChanges[existingChangeIndex].value = newState;
      } else {
        stateChanges.push({ path: storeName, value: newState });
      }
  
      return [...stateChanges];
    }
  
    function handleStateSubscription(command: Command): void {
      activeSubscriptions = command?.payload?.paths || [];
  
      if (activeSubscriptions.length === 0) {
        stateChanges = [];
        resetStores();
        unsubscribeFromStores();
        reactotron.send("state.values.change", { changes: stateChanges });
        return;
      }
  
      reactotron.stores
        .filter(
          (store) =>
            activeSubscriptions.includes(store.name) ||
            activeSubscriptions.some((sub) =>
              ["", "*", "all", "root"].includes(sub)
            )
        )
        .forEach((store) => {
          const observable = store.observable;
  
          // Set up observer for state changes
          pluginConfig.observe(() => {
            const newState = observable.get();
            stateChanges = trackStateChange(store.name, newState);
            reactotron.stateValuesChange(stateChanges);
          });
  
          const unsubscribe = () => {
            pluginConfig.observe(() =>
              reactotron.stateValuesChange(
                trackStateChange(store.name, observable.get())
              )
            );
          };
  
          reactotron.unsubscriptions.push(unsubscribe);
  
          // Send the initial state
          const initialState = observable.get();
          stateChanges = trackStateChange(store.name, initialState);
          reactotron.stateValuesChange(stateChanges);
        });
    }
  
    return {
      onCommand: (command: Command) => {
        if (command?.type === "state.values.subscribe") {
          handleStateSubscription(command);
        }
      },
      features: {},
    };
  };
  