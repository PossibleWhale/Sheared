/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */

import ui.View;
import ui.ImageView;

/* The title screen is added to the scene graph when it becomes
 * a child of the main application. When this class is instantiated,
 * it adds the start button as a child.
 */
exports = Class(ui.ImageView, function (supr) {
        this.init = function (opts) {
                opts = merge(opts, {
                        image: "resources/images/title-dev.png"
                });

                supr(this, 'init', [opts]);

                this.build();
        };

        this.build = function() {
            console.log("build title screen");
        };
});
