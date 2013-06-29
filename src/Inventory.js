import src.constants as c;
import event.Emitter as Emitter;
import GCDataSource;


var wools = [
    {color: c.COLOR_WHITE.label, count: 0},
    {color: c.COLOR_RED.label, count: 0},
    {color: c.COLOR_BLUE.label, count: 0},
    {color: c.COLOR_YELLOW.label, count: 0},
    {color: c.COLOR_BLACK.label, count: 0}
];

var crafts = [
    {motif: 'naked|none|none', count: 0}
];

exports = Class(Emitter, function Inventory_(supr) {
    this.init = function () {
        supr(this, 'init', arguments);

        this.wool = new GCDataSource({key: 'color'});
        this.wool.add(wools);
        this.wool.on('Update', function (clabel, item) {
            this.emit('inventory:colorUpdate', clabel, item);
        });
 
        this.crafts = new GCDataSource({key: 'motif'});
        this.crafts.add(crafts);
        this.crafts.on('Update', function (motif, item) {
            this.emit('inventory:craftUpdate', motif, item);
        });

        this.addWool = bind(this, function (color, amt) {
            if (! typeof color === 'string') {
                clabel = color.label;
            } else {
                clabel = color;
            }
            var old = this.wool.get(clabel).count;
            this.wool.add({color: clabel, count: old + (amt || 1)});
        });

        this.addCraft = bind(this, function (garment, main, contrast) {
            if (typeof garment === 'string') {
                garment = c.garmentsByLabel[garment];
            }
            if (typeof main === 'string') {
                main = c.colorsByLabel[main];
            }
            if (typeof contrast === 'string') {
                contrast = c.colorsByLabel[contrast];
            }
            this._crafts.push(new Craft(garment, main, contrast));
            this.emit('inventory:craftAdded', garment, main, contrast);
        });

        /*
         * make a copy of the inventory so i can make temp modifications to it
         */
        this.copy = bind(this, function () {
            import src.Inventory as Inventory;
            var ret = new Inventory();

            ret.wool.fromJSON(this.wool.toJSON());
            ret.crafts.fromJSON(this.crafts.toJSON());

            return ret;
        });

        /*
         * load the data of this inventory from another inventory
         */
        this.merge = bind(this, function (other) {
            this.wool.clear();
            this.crafts.clear();
            this.wool.fromJSON(other.wool.toJSON());
            this.crafts.fromJSON(other.crafts.toJSON());
            return this;
        });

        /*
         * Hack! given obj with a key for each color, load it into this.wool
         * GCDataSource
         */
        this.loadWool = bind(this, function (obj) {
            var _tmpArr = [];
            for (var k in obj) {
                _tmpArr.push({'color': k, 'count': obj[k]});
            }
            this.wool.add(_tmpArr);
        });
    };
});
