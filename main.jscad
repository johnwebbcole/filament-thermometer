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
        name: 'starttemp',
        type: 'number',
        caption: 'Start Temperature:',
        initial: '235'
    }];
}


function main(params) {
    util.init(CSG);
    Colors.init(CSG);
    echo('params', JSON.stringify(params));


    var cube = Parts.Cube([10, 10, 50]);

    var core = cube.union(Parts.Cylinder(10, 50).align(cube, 'xyz').snap(cube, 'x', 'center+').color('gray'));

    var stripes = [];

    var stripe = Parts.Cube([1, 10, 1]).color('blue');

    _.range(10, 50, 10).forEach(function (height) {
        stripes.push(stripe.snap(core, 'x', 'outside-').translate([0, 0, height]));
    });

    var labels = [];

    _.range(params.starttemp, params.starttemp - 5, -1).forEach(function (temp, i) {
        labels.push(util.label('' + temp, 0, 0, 3, 0.5)
            .fit(8, 8, 0, true)
            .rotateX(90)
            .rotateZ(90)
            .snap(core, 'x', 'outside-')
            .snap(core, 'z', 'inside-')
            .align(core, 'y')
            .translate([0, 0, 4 + (i * 10)])
            .color('green'));
    });



    return union([
        core
        .subtract(core.enlarge([-2, -2, -1]).snap(core, 'z', 'inside+'))
        .subtract(union(labels).rotateZ(-90).snap(core, 'y', 'inside-')),
        union(stripes),
        union(labels)

    ]);
}
