/* globals temperatureTest */
/* exported temperatureTest */
temperatureTest = {
  UnitCube: function () {
    return CSG.cube({
      center: [0, 0, 0],
      radius: [1, 1, 1]
    });
  },

  Sample: function () {
    var box1 = Parts.Cube([10, 10, 10]).Zero();
    var box2 = Parts.Cube([5, 5, 5]).snap(box1, 'z', 'outside+').color('blue').align(box1, 'xy');

    var cyl1 = Parts.Cylinder(5, 10).rotateX(90).snap(box2, 'x', 'outside+').align(box2, 'xz');
    return box1.union([box2, cyl1]);
  },

  Create: function (part, options) {
    // return this.UnitCube();
    return this[part](options);
  }
};