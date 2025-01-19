# Reactotron plugin for legend-state library
This plugin integrates Reactotron with the legend-state library, enabling you to monitor state changes directly in Reactotron.

It has been tested with async storage as the storage handler.

## Installation

Using Yarn:
```bash
yarn add reactotron-legendstate-plugin
```

Using npm:
```bash
npm install reactotron-legendstate-plugin
```

## Usage

```javascript
import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import reactotronLegendState from "reactotron-legendstate-plugin";
import observable$ from "path/to/observable";
import { observe } from "@legendapp/state";

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage can be from `react-native` or `@react-native-community/async-storage`
    .configure({
        name: 'Project Name',
    }) // controls connection & communication settings
    .useReactNative() // add all built-in React Native plugins
    .use(
        // add this line 🙌
        reactotronLegendState({
            stores: [
                { name: 'observable', observable: observable$ },
            ],
            observe
        })
    ) // plus some custom plugins
    .connect(); // let's connect!
```

**Note:** You need to add a new subscription with the store name (in this case, `observable`) under the state tab in Reactotron to monitor state changes.