interface Store {
    name: string;
    observable: {
      get: () => any;
    };
  }
  
  interface PluginConfig {
    stores?: Store[];
    observe: (fn: () => void) => void;
  }
  
  interface Command {
    type: string;
    payload?: {
      paths?: string[];
    };
  }
  
  interface StateChange {
    path: string;
    value: any;
  }
  
  interface Reactotron {
    unsubscriptions: (() => void)[];
    stores: Store[];
    send: (type: string, payload: any) => void;
    stateValuesChange: (changes: StateChange[]) => void;
  }

  export { Store, PluginConfig, Command, StateChange, Reactotron };