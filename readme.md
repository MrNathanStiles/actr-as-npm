# ActR WASM API for Assembly Script 

## Steps to create a new project
`npm init`

`npm install --save-dev assemblyscript`

`npx asinit .`

`npm install --save @actr-wasm/as@latest`

See the code sample below for how to create a program.
### Starter index.ts

    import { ActrUIControlButton, ActrUIState } from "@actr-wasm/as";

    export { actr_construct } from '@actr-wasm/as';

    let ui!: ActrUIState;
    let button!: ActrUIControlButton;
    let tapCount = 0;

    export function actr_init(w: i32, h: i32): void {
        ui = new ActrUIState(w, h);
        button = ui.addButton(100, 100, 500, 25, "Hello World");
    }

    export function actr_resize(w: i32, h: i32): void {
        ui.actr_ui_resize(w, h);
    }

    export function actr_pointer_move(x: i32, y: i32): void {
        ui.actr_ui_move(x, y);
    }

    export function actr_pointer_tap(x: i32, y: i32): void {
        const target = ui.actr_ui_tap(x, y);
        if (target == button) {
            tapCount++;
            button.label = `Hello World button got ${tapCount} ${tapCount == 1 ? 'tap' : 'taps'}.`;
        }
    }

    export function actr_step(delta: f64): void {
        ui.draw();
    }

