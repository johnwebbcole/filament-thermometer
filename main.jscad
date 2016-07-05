// title      : temperatureTest
// author     : John Cole
// license    : ISC License
// file       : main.jscad

// include:js
// endinject
/* exported main, getParameterDefinitions */
/* globals _, util, Colors, Parts */

function getParameterDefinitions() {
    return [{
        name: 'label',
        type: 'text',
        caption: 'Label:',
        initial: 'eSUN PLA+'
    }, {
        name: 'segments',
        type: 'number',
        caption: 'Segments:',
        initial: 4
    }, {
        name: 'starttemp',
        type: 'number',
        caption: 'Start Temperature:',
        initial: '225'
    }];
}


function main(params) {
    util.init(CSG);
    Colors.init(CSG);
    echo('params', JSON.stringify(params));

    // var height = params.segments * 10;
    var height = 5;

    var cube = Parts.Cube([20, 20, 5]);

    var lip = Parts.Cube([20, 1, 1])
        .snap(cube, 'z', 'inside+')
        .snap(cube, 'y', 'outside+')
        .align(cube, 'x');


    var cylinder = Parts.Cylinder(20, 5).align(cube, 'xz').snap(cube, 'y', 'center-').color('blue');

    var cut = Parts.Cube([5, 2.5, 2.5])
        // .snap(cube, 'z', 'inside+')
        .snap(cylinder, 'y', 'outside-')
        .align(cylinder, 'xz')
        .translate([0, -2, 0])
        .color('red');

    var core = cube.union(cylinder);

    var cores = [];

    var temp = params.starttemp;

    _.range(0, height * params.segments, height).forEach(function (pos) {
        var label = util.label('' + temp, 0, 0, 4, 0.5)
            .fit(5, 5, 0, true)
            .rotateX(90)
            .align(core, 'zx')
            .snap(core, 'y', 'outside+')
            .color('green');

        temp--;

        cores.push(core.subtract(cut).union([lip, label]).subtract(core.enlarge([-1, -1, 0])).translate([0, 0, pos]));

    });

    var base = Parts.Cube([30, 50, 5]).chamfer(2, 'z+').chamfer(0.5, 'z-').color('orange');

    var baselabel = util.label(params.label, 0, 0, 4, 1)
        .fit(20, 10, 0, true)
        .align(base, 'x')
        .snap(base, 'z', 'outside-')
        .snap(base, 'y', 'inside-')
        .translate([0, 4, 0]);

    var c = union(cores).align(base, 'xy').snap(base, 'z', 'outside-');

    return base.union(baselabel).union([c.fillet(-1, 'z-'), c.fillet(1, 'z-')]);

    // .translate([0, 0, 5])
    // .union(cyl)
    // .subtract(Parts.Cylinder(10, height * params.segments + 5)
    //     .enlarge([-1, -1, 0])
    //     .align(cyl, 'xy')
    //     .snap(cyl, 'z', 'inside-')
    //     .translate([0, 0, 2]));

}
