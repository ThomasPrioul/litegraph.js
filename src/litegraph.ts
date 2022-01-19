
import { LGraphNode } from "./LGraphNode";

/**
 * The Global Scope. It contains all the registered node classes.
 * @class LiteGraph
 */
export class LiteGraph {
  static VERSION = 0.4;
  static CANVAS_GRID_SIZE = 10;
  static NODE_TITLE_HEIGHT = 30;
  static NODE_TITLE_TEXT_Y = 20;
  static NODE_SLOT_HEIGHT = 20;
  static NODE_WIDGET_HEIGHT = 20;
  static NODE_WIDTH = 140;
  static NODE_MIN_WIDTH = 50;
  static NODE_COLLAPSED_RADIUS = 10;
  static NODE_COLLAPSED_WIDTH = 80;
  static NODE_TITLE_COLOR = "#999";
  static NODE_SELECTED_TITLE_COLOR = "#FFF";
  static NODE_TEXT_SIZE = 14;
  static NODE_TEXT_COLOR = "#AAA";
  static NODE_SUBTEXT_SIZE = 12;
  static NODE_DEFAULT_COLOR = "#333";
  static NODE_DEFAULT_BGCOLOR = "#353535";
  static NODE_DEFAULT_BOXCOLOR = "#666";
  static NODE_DEFAULT_SHAPE = "box";
  static NODE_BOX_OUTLINE_COLOR = "#FFF";
  static DEFAULT_SHADOW_COLOR = "rgba(0,0,0,0.5)";
  static DEFAULT_GROUP_FONT = 24;

  static WIDGET_BGCOLOR = "#222";
  static WIDGET_OUTLINE_COLOR = "#666";
  static WIDGET_TEXT_COLOR = "#DDD";
  static WIDGET_SECONDARY_TEXT_COLOR = "#999";

  static LINK_COLOR = "#9A9";
  static EVENT_LINK_COLOR = "#A86";
  static CONNECTING_LINK_COLOR = "#AFA";

  /** Avoid infinite loops */
  static MAX_NUMBER_OF_NODES = 1000;

  /** Default node position */
  static DEFAULT_POSITION = [100, 100];
  static VALID_SHAPES = ["default", "box", "round", "card"];

  //shapes are used for nodes but also for slots
  static BOX_SHAPE = 1;
  static ROUND_SHAPE = 2;
  static CIRCLE_SHAPE = 3;
  static CARD_SHAPE = 4;
  static ARROW_SHAPE = 5;

  /** Intended for slot arrays */
  static GRID_SHAPE = 6;

  //enums
  static INPUT = 1;
  static OUTPUT = 2;

  /** For outputs */
  static EVENT = -1;

  /** For inputs */
  static ACTION = -1;

  static NODE_MODES = ["Always", "On Event", "Never", "On Trigger"]; // helper; will add "On Request" and more in the future

  /** use with node_box_coloured_by_mode */
  static NODE_MODES_COLORS = ["#666", "#422", "#333", "#224", "#626"];
  static ALWAYS = 0;
  static ON_EVENT = 1;
  static NEVER = 2;
  static ON_TRIGGER = 3;

  static UP = 1;
  static DOWN = 2;
  static LEFT = 3;
  static RIGHT = 4;
  static CENTER = 5;

  static LINK_RENDER_MODES = ["Straight", "Linear", "Spline"]; // helper
  static STRAIGHT_LINK = 0;
  static LINEAR_LINK = 1;
  static SPLINE_LINK = 2;

  static NORMAL_TITLE = 0;
  static NO_TITLE = 1;
  static TRANSPARENT_TITLE = 2;
  static AUTOHIDE_TITLE = 3;
  static VERTICAL_LAYOUT = "vertical"; // arrange nodes vertically

  static proxy = null; //used to redirect calls
  static node_images_path = "";

  static debug = false;
  static catch_exceptions = true;
  static throw_errors = true;
  static allow_scripts = false; //if set to true some nodes like Formula would be allowed to evaluate code that comes from unsafe sources (like node configuration); which could lead to exploits
  static registered_node_types = {}; //nodetypes by string
  static node_types_by_file_extension = {}; //used for dropping files in the canvas
  static Nodes = {}; //node types by classname
  static Globals = {}; //used to store vars between graphs

  static searchbox_extras = {}; //used to add extra features to the search box
  static auto_sort_node_types = false; // [true!] If set to true; will automatically sort node types / categories in the context menus

  static node_box_coloured_when_on = false; // [true!] this make the nodes box (top left circle) coloured when triggered (execute/action); visual feedback
  static node_box_coloured_by_mode = false; // [true!] nodebox based on node mode; visual feedback

  static dialog_close_on_mouse_leave = true; // [false on mobile] better true if not touch device; TODO add an helper/listener to close if false
  static dialog_close_on_mouse_leave_delay = 500;

  static shift_click_do_break_link_from = false; // [false!] prefer false if results too easy to break links - implement with ALT or TODO custom keys
  static click_do_break_link_to = false; // [false!]prefer false; way too easy to break links

  static search_hide_on_mouse_leave = true; // [false on mobile] better true if not touch device; TODO add an helper/listener to close if false
  static search_filter_enabled = false; // [true!] enable filtering slots type in the search widget; !requires auto_load_slot_types or manual set registered_slot_[in/out]_types and slot_types_[in/out]
  static search_show_all_on_open = true; // [true!] opens the results list when opening the search widget

  static auto_load_slot_types = false; // [if want false, use true, run, get vars values to be statically set, than disable] nodes types and nodeclass association with node types need to be calculated, if dont want this; calculate once and set registered_slot_[in/out]_types and slot_types_[in/out]

  // set these values if not using auto_load_slot_types
  static registered_slot_in_types = {}; // slot types for nodeclass
  static registered_slot_out_types = {}; // slot types for nodeclass
  static slot_types_in = []; // slot types IN
  static slot_types_out = []; // slot types OUT
  static slot_types_default_in = []; // specify for each IN slot type a(/many) deafult node(s), use single string, array, or object (with node, title, parameters; ..) like for search
  static slot_types_default_out = []; // specify for each OUT slot type a(/many) deafult node(s), use single string, array, or object (with node, title, parameters; ..) like for search

  static alt_drag_do_clone_nodes = false; // [true!] very handy; ALT click to clone and drag the new node

  static do_add_triggers_slots = false; // [true!] will create and connect event slots when using action/events connections, !WILL CHANGE node mode when using onTrigger (enable mode colors); onExecuted does not need this

  static allow_multi_output_for_events = true; // [false!] being events, it is strongly reccomended to use them sequentually; one by one

  static middle_click_slot_add_default_node = false; //[true!] allows to create and connect a ndoe clicking with the third button (wheel)

  static release_link_on_empty_shows_menu = false; //[true!] dragging a link to empty space will open a menu, add from list; search or defaults

  static pointerevents_method = "mouse"; // "mouse"|"pointer" use mouse for retrocompatibility issues? (none found @ now)
  // TODO implement pointercancel, gotpointercapture, lostpointercapture, (pointerover, pointerout if necessary)

  /**
   * Register a node class so it can be listed when the user wants to create a new one
   * @method registerNodeType
   * @param {String} type name of the node and path
   * @param {Class} base_class class containing the structure of a node
   */
  registerNodeType(type: string, base_class: LGraphNode) {

    base_class.type = type;

    if (LiteGraph.debug) {
      console.log("Node registered: " + type);
    }

    var categories = type.split("/");
    var classname = base_class.name;

    var pos = type.lastIndexOf("/");
    base_class.category = type.substr(0, pos);

    if (!base_class.title) {
      base_class.title = classname;
    }
    //info.name = name.substr(pos+1,name.length - pos);

    //extend class
    if (base_class.prototype) {
      //is a class
      for (var i in LGraphNode.prototype) {
        if (!base_class.prototype[i]) {
          base_class.prototype[i] = LGraphNode.prototype[i];
        }
      }
    }

    var prev = this.registered_node_types[type];
    if (prev)
      console.log("replacing node type: " + type);
    else {
      if (!Object.hasOwnProperty(base_class.prototype, "shape"))
        Object.defineProperty(base_class.prototype, "shape", {
          set: function (v) {
            switch (v) {
              case "default":
                delete this._shape;
                break;
              case "box":
                this._shape = LiteGraph.BOX_SHAPE;
                break;
              case "round":
                this._shape = LiteGraph.ROUND_SHAPE;
                break;
              case "circle":
                this._shape = LiteGraph.CIRCLE_SHAPE;
                break;
              case "card":
                this._shape = LiteGraph.CARD_SHAPE;
                break;
              default:
                this._shape = v;
            }
          },
          get: function (v) {
            return this._shape;
          },
          enumerable: true,
          configurable: true
        });

      //warnings
      if (base_class.prototype.onPropertyChange) {
        console.warn(
          "LiteGraph node class " +
          type +
          " has onPropertyChange method, it must be called onPropertyChanged with d at the end"
        );
      }

      //used to know which nodes create when dragging files to the canvas
      if (base_class.supported_extensions) {
        for (var i in base_class.supported_extensions) {
          var ext = base_class.supported_extensions[i];
          if (ext && ext.constructor === String)
            this.node_types_by_file_extension[ext.toLowerCase()] = base_class;
        }
      }
    }

    this.registered_node_types[type] = base_class;
    if (base_class.constructor.name) {
      this.Nodes[classname] = base_class;
    }
    if (LiteGraph.onNodeTypeRegistered) {
      LiteGraph.onNodeTypeRegistered(type, base_class);
    }
    if (prev && LiteGraph.onNodeTypeReplaced) {
      LiteGraph.onNodeTypeReplaced(type, base_class, prev);
    }

    //warnings
    if (base_class.prototype.onPropertyChange) {
      console.warn(
        "LiteGraph node class " +
        type +
        " has onPropertyChange method, it must be called onPropertyChanged with d at the end"
      );
    }

    //used to know which nodes create when dragging files to the canvas
    if (base_class.supported_extensions) {
      for (var i = 0; i < base_class.supported_extensions.length; i++) {
        var ext = base_class.supported_extensions[i];
        if (ext && ext.constructor === String)
          this.node_types_by_file_extension[ext.toLowerCase()] = base_class;
      }
    }

    // TODO one would want to know input and ouput :: this would allow trought registerNodeAndSlotType to get all the slots types
    //console.debug("Registering "+type);
    if (this.auto_load_slot_types)
      nodeTmp = new base_class(base_class.title || "tmpnode");
  }

  /**
   * removes a node type from the system
   * @method unregisterNodeType
   * @param {String|Object} type name of the node or the node constructor itself
   */
  unregisterNodeType(type) {
    var base_class = type.constructor === String ? this.registered_node_types[type] : type;
    if (!base_class)
      throw ("node type not found: " + type);
    delete this.registered_node_types[base_class.type];
    if (base_class.constructor.name)
      delete this.Nodes[base_class.constructor.name];
  }

  /**
  * Save a slot type and his node
  * @method registerSlotType
  * @param {String|Object} type name of the node or the node constructor itself
  * @param {String} slot_type name of the slot type (variable type), eg. string, number, array, boolean, ..
  */
  registerNodeAndSlotType(type, slot_type, out) {
    out = out || false;
    var base_class = type.constructor === String && this.registered_node_types[type] !== "anonymous" ? this.registered_node_types[type] : type;

    var sCN = base_class.constructor.type;

    if (typeof slot_type == "string") {
      var aTypes = slot_type.split(",");
    } else if (slot_type == this.EVENT || slot_type == this.ACTION) {
      var aTypes = ["_event_"];
    } else {
      var aTypes = ["*"];
    }

    for (var i = 0; i < aTypes.length; ++i) {
      var sT = aTypes[i]; //.toLowerCase();
      if (sT === "") {
        sT = "*";
      }
      var registerTo = out ? "registered_slot_out_types" : "registered_slot_in_types";
      if (typeof this[registerTo][sT] == "undefined") this[registerTo][sT] = { nodes: [] };
      this[registerTo][sT].nodes.push(sCN);

      // check if is a new type
      if (!out) {
        if (!this.slot_types_in.includes(sT.toLowerCase())) {
          this.slot_types_in.push(sT.toLowerCase());
          this.slot_types_in.sort();
        }
      } else {
        if (!this.slot_types_out.includes(sT.toLowerCase())) {
          this.slot_types_out.push(sT.toLowerCase());
          this.slot_types_out.sort();
        }
      }
    }
  }

  /**
   * Create a new nodetype by passing a function, it wraps it with a proper class and generates inputs according to the parameters of the function.
   * Useful to wrap simple methods that do not require properties, and that only process some input to generate an output.
   * @method wrapFunctionAsNode
   * @param {String} name node name with namespace (p.e.: 'math/sum')
   * @param {Function} func
   * @param {Array} param_types [optional] an array containing the type of every parameter, otherwise parameters will accept any type
   * @param {String} return_type [optional] string with the return type, otherwise it will be generic
   * @param {Object} properties [optional] properties to be configurable
   */
  wrapFunctionAsNode(
    name,
    func,
    param_types,
    return_type,
    properties
  ) {
    var params = Array(func.length);
    var code = "";
    var names = getParameterNames(func);
    for (var i = 0; i < names.length; ++i) {
      code +=
        "this.addInput('" +
        names[i] +
        "'," +
        (param_types && param_types[i]
          ? "'" + param_types[i] + "'"
          : "0") +
        ");\n";
    }
    code +=
      "this.addOutput('out'," +
      (return_type ? "'" + return_type + "'" : 0) +
      ");\n";
    if (properties) {
      code +=
        "this.properties = " + JSON.stringify(properties) + ";\n";
    }
    var classobj = Function(code);
    classobj.title = name.split("/").pop();
    classobj.desc = "Generated from " + func.name;
    classobj.prototype.onExecute = function onExecute() {
      for (var i = 0; i < params.length; ++i) {
        params[i] = this.getInputData(i);
      }
      var r = func.apply(this, params);
      this.setOutputData(0, r);
    };
    this.registerNodeType(name, classobj);
  }

  /**
   * Removes all previously registered node's types
   */
  clearRegisteredTypes() {
    this.registered_node_types = {};
    this.node_types_by_file_extension = {};
    this.Nodes = {};
    this.searchbox_extras = {};
  }

  /**
   * Adds this method to all nodetypes, existing and to be created
   * (You can add it to LGraphNode.prototype but then existing node types wont have it)
   * @method addNodeMethod
   * @param {Function} func
   */
  addNodeMethod(name, func) {
    LGraphNode.prototype[name] = func;
    for (var i in this.registered_node_types) {
      var type = this.registered_node_types[i];
      if (type.prototype[name]) {
        type.prototype["_" + name] = type.prototype[name];
      } //keep old in case of replacing
      type.prototype[name] = func;
    }
  }

  /**
   * Create a node of a given type with a name. The node is not attached to any graph yet.
   * @method createNode
   * @param {String} type full name of the node class. p.e. "math/sin"
   * @param {String} name a name to distinguish from other nodes
   * @param {Object} options to set options
   */

  createNode(type, title, options) {
    var base_class = this.registered_node_types[type];
    if (!base_class) {
      if (LiteGraph.debug) {
        console.log(
          'GraphNode type "' + type + '" not registered.'
        );
      }
      return null;
    }

    var prototype = base_class.prototype || base_class;

    title = title || base_class.title || type;

    var node = null;

    if (LiteGraph.catch_exceptions) {
      try {
        node = new base_class(title);
      } catch (err) {
        console.error(err);
        return null;
      }
    } else {
      node = new base_class(title);
    }

    node.type = type;

    if (!node.title && title) {
      node.title = title;
    }
    if (!node.properties) {
      node.properties = {};
    }
    if (!node.properties_info) {
      node.properties_info = [];
    }
    if (!node.flags) {
      node.flags = {};
    }
    if (!node.size) {
      node.size = node.computeSize();
      //call onresize?
    }
    if (!node.pos) {
      node.pos = LiteGraph.DEFAULT_POSITION.concat();
    }
    if (!node.mode) {
      node.mode = LiteGraph.ALWAYS;
    }

    //extra options
    if (options) {
      for (var i in options) {
        node[i] = options[i];
      }
    }

    // callback
    if (node.onNodeCreated) {
      node.onNodeCreated();
    }

    return node;
  }

  /**
   * Returns a registered node type with a given name
   * @method getNodeType
   * @param {String} type full name of the node class. p.e. "math/sin"
   * @return {Class} the node class
   */
  getNodeType(type) {
    return this.registered_node_types[type];
  }

  /**
   * Returns a list of node types matching one category
   * @method getNodeType
   * @param {String} category category name
   * @return {Array} array with all the node classes
   */

  getNodeTypesInCategory(category, filter) {
    var r = [];
    for (var i in this.registered_node_types) {
      var type = this.registered_node_types[i];
      if (type.filter != filter) {
        continue;
      }

      if (category == "") {
        if (type.category == null) {
          r.push(type);
        }
      } else if (type.category == category) {
        r.push(type);
      }
    }

    if (this.auto_sort_node_types) {
      r.sort(function (a, b) { return a.title.localeCompare(b.title) });
    }

    return r;
  }

  /**
   * Returns a list with all the node type categories
   * @method getNodeTypesCategories
   * @param {String} filter only nodes with ctor.filter equal can be shown
   * @return {Array} array with all the names of the categories
   */
  getNodeTypesCategories(filter) {
    var categories = { "": 1 };
    for (var i in this.registered_node_types) {
      var type = this.registered_node_types[i];
      if (type.category && !type.skip_list) {
        if (type.filter != filter)
          continue;
        categories[type.category] = 1;
      }
    }
    var result = [];
    for (var i in categories) {
      result.push(i);
    }
    return this.auto_sort_node_types ? result.sort() : result;
  }

  //debug purposes: reloads all the js scripts that matches a wildcard
  reloadNodes(folder_wildcard) {
    var tmp = document.getElementsByTagName("script");
    //weird, this array changes by its own, so we use a copy
    var script_files = [];
    for (var i = 0; i < tmp.length; i++) {
      script_files.push(tmp[i]);
    }

    var docHeadObj = document.getElementsByTagName("head")[0];
    folder_wildcard = document.location.href + folder_wildcard;

    for (var i = 0; i < script_files.length; i++) {
      var src = script_files[i].src;
      if (
        !src ||
        src.substr(0, folder_wildcard.length) != folder_wildcard
      ) {
        continue;
      }

      try {
        if (LiteGraph.debug) {
          console.log("Reloading: " + src);
        }
        var dynamicScript = document.createElement("script");
        dynamicScript.type = "text/javascript";
        dynamicScript.src = src;
        docHeadObj.appendChild(dynamicScript);
        docHeadObj.removeChild(script_files[i]);
      } catch (err) {
        if (LiteGraph.throw_errors) {
          throw err;
        }
        if (LiteGraph.debug) {
          console.log("Error while reloading " + src);
        }
      }
    }

    if (LiteGraph.debug) {
      console.log("Nodes reloaded");
    }
  }

  //separated just to improve if it doesn't work
  cloneObject(obj, target) {
    if (obj == null) {
      return null;
    }
    var r = JSON.parse(JSON.stringify(obj));
    if (!target) {
      return r;
    }

    for (var i in r) {
      target[i] = r[i];
    }
    return target;
  }

  /**
   * Returns if the types of two slots are compatible (taking into account wildcards, etc)
   * @method isValidConnection
   * @param {String} type_a
   * @param {String} type_b
   * @return {Boolean} true if they can be connected
   */
  isValidConnection(type_a, type_b) {
    if (type_a == "" || type_a === "*") type_a = 0;
    if (type_b == "" || type_b === "*") type_b = 0;
    if (
      !type_a //generic output
      || !type_b // generic input
      || type_a == type_b //same type (is valid for triggers)
      || (type_a == LiteGraph.EVENT && type_b == LiteGraph.ACTION)
    ) {
      return true;
    }

    // Enforce string type to handle toLowerCase call (-1 number not ok)
    type_a = String(type_a);
    type_b = String(type_b);
    type_a = type_a.toLowerCase();
    type_b = type_b.toLowerCase();

    // For nodes supporting multiple connection types
    if (type_a.indexOf(",") == -1 && type_b.indexOf(",") == -1) {
      return type_a == type_b;
    }

    // Check all permutations to see if one is valid
    var supported_types_a = type_a.split(",");
    var supported_types_b = type_b.split(",");
    for (var i = 0; i < supported_types_a.length; ++i) {
      for (var j = 0; j < supported_types_b.length; ++j) {
        if (this.isValidConnection(supported_types_a[i], supported_types_b[j])) {
          //if (supported_types_a[i] == supported_types_b[j]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Register a string in the search box so when the user types it it will recommend this node
   * @method registerSearchboxExtra
   * @param {String} node_type the node recommended
   * @param {String} description text to show next to it
   * @param {Object} data it could contain info of how the node should be configured
   * @return {Boolean} true if they can be connected
   */
  registerSearchboxExtra(node_type, description, data) {
    this.searchbox_extras[description.toLowerCase()] = {
      type: node_type,
      desc: description,
      data: data
    };
  }

  /**
   * Wrapper to load files (from url using fetch or from file using FileReader)
   * @method fetchFile
   * @param {String|File|Blob} url the url of the file (or the file itself)
   * @param {String} type an string to know how to fetch it: "text","arraybuffer","json","blob"
   * @param {Function} on_complete callback(data)
   * @param {Function} on_error in case of an error
   * @return {FileReader|Promise} returns the object used to 
   */
  fetchFile(url, type, on_complete, on_error) {
    var that = this;
    if (!url)
      return null;

    type = type || "text";
    if (url.constructor === String) {
      if (url.substr(0, 4) == "http" && LiteGraph.proxy) {
        url = LiteGraph.proxy + url.substr(url.indexOf(":") + 3);
      }
      return fetch(url)
        .then(function (response) {
          if (!response.ok)
            throw new Error("File not found"); //it will be catch below
          if (type == "arraybuffer")
            return response.arrayBuffer();
          else if (type == "text" || type == "string")
            return response.text();
          else if (type == "json")
            return response.json();
          else if (type == "blob")
            return response.blob();
        })
        .then(function (data) {
          if (on_complete)
            on_complete(data);
        })
        .catch(function (error) {
          console.error("error fetching file:", url);
          if (on_error)
            on_error(error);
        });
    }
    else if (url.constructor === File || url.constructor === Blob) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var v = e.target.result;
        if (type == "json")
          v = JSON.parse(v);
        if (on_complete)
          on_complete(v);
      }
      if (type == "arraybuffer")
        return reader.readAsArrayBuffer(url);
      else if (type == "text" || type == "json")
        return reader.readAsText(url);
      else if (type == "blob")
        return reader.readAsBinaryString(url);
    }
    return null;
  }

  compareObjects(a, b) {
    for (var i in a) {
      if (a[i] != b[i]) {
        return false;
      }
    }
    return true;
  }

  distance(a, b) {
    return Math.sqrt(
      (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])
    );
  }

  colorToString(c) {
    return (
      "rgba(" +
      Math.round(c[0] * 255).toFixed() +
      "," +
      Math.round(c[1] * 255).toFixed() +
      "," +
      Math.round(c[2] * 255).toFixed() +
      "," +
      (c.length == 4 ? c[3].toFixed(2) : "1.0") +
      ")"
    );
  }

  isInsideRectangle(x, y, left, top, width, height) {
    if (left < x && left + width > x && top < y && top + height > y) {
      return true;
    }
    return false;
  }

  //[minx,miny,maxx,maxy]
  growBounding(bounding, x, y) {
    if (x < bounding[0]) {
      bounding[0] = x;
    } else if (x > bounding[2]) {
      bounding[2] = x;
    }

    if (y < bounding[1]) {
      bounding[1] = y;
    } else if (y > bounding[3]) {
      bounding[3] = y;
    }
  }

  //point inside bounding box
  isInsideBounding(p, bb) {
    if (
      p[0] < bb[0][0] ||
      p[1] < bb[0][1] ||
      p[0] > bb[1][0] ||
      p[1] > bb[1][1]
    ) {
      return false;
    }
    return true;
  }

  //Convert a hex value to its decimal value - the inputted hex must be in the
  //	format of a hex triplet - the kind we use for HTML colours. The function
  //	will return an array with three values.
  hex2num(hex) {
    if (hex.charAt(0) == "#") {
      hex = hex.slice(1);
    } //Remove the '#' char - if there is one.
    hex = hex.toUpperCase();
    var hex_alphabets = "0123456789ABCDEF";
    var value = new Array(3);
    var k = 0;
    var int1, int2;
    for (var i = 0; i < 6; i += 2) {
      int1 = hex_alphabets.indexOf(hex.charAt(i));
      int2 = hex_alphabets.indexOf(hex.charAt(i + 1));
      value[k] = int1 * 16 + int2;
      k++;
    }
    return value;
  }

  //Give a array with three values as the argument and the function will return
  //	the corresponding hex triplet.
  num2hex(triplet) {
    var hex_alphabets = "0123456789ABCDEF";
    var hex = "#";
    var int1, int2;
    for (var i = 0; i < 3; i++) {
      int1 = triplet[i] / 16;
      int2 = triplet[i] % 16;

      hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
    }
    return hex;
  }

  closeAllContextMenus(ref_window) {
    ref_window = ref_window || window;

    var elements = ref_window.document.querySelectorAll(".litecontextmenu");
    if (!elements.length) {
      return;
    }

    var result = [];
    for (var i = 0; i < elements.length; i++) {
      result.push(elements[i]);
    }

    for (var i = 0; i < result.length; i++) {
      if (result[i].close) {
        result[i].close();
      } else if (result[i].parentNode) {
        result[i].parentNode.removeChild(result[i]);
      }
    }
  }

  extendClass(target, origin) {
    for (var i in origin) {
      //copy class properties
      if (target.hasOwnProperty(i)) {
        continue;
      }
      target[i] = origin[i];
    }

    if (origin.prototype) {
      //copy prototype properties
      for (var i in origin.prototype) {
        //only enumerable
        if (!origin.prototype.hasOwnProperty(i)) {
          continue;
        }

        if (target.prototype.hasOwnProperty(i)) {
          //avoid overwriting existing ones
          continue;
        }

        //copy getters
        if (origin.prototype.__lookupGetter__(i)) {
          target.prototype.__defineGetter__(
            i,
            origin.prototype.__lookupGetter__(i)
          );
        } else {
          target.prototype[i] = origin.prototype[i];
        }

        //and setters
        if (origin.prototype.__lookupSetter__(i)) {
          target.prototype.__defineSetter__(
            i,
            origin.prototype.__lookupSetter__(i)
          );
        }
      }
    }
  }

  //used to create nodes from wrapping functions
  getParameterNames(func) {
    return (func + "")
      .replace(/[/][/].*$/gm, "") // strip single-line comments
      .replace(/\s+/g, "") // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments  /**/
      .split("){", 1)[0]
      .replace(/^[^(]*[(]/, "") // extract the parameters
      .replace(/=[^,]+/g, "") // strip any ES6 defaults
      .split(",")
      .filter(Boolean); // split & filter [""]
  }

  /* helper for interaction: pointer, touch, mouse Listeners
  used by LGraphCanvas DragAndScale ContextMenu*/
  pointerListenerAdd(oDOM, sEvIn, fCall, capture = false) {
    if (!oDOM || !oDOM.addEventListener || !sEvIn || typeof fCall !== "function") {
      //console.log("cant pointerListenerAdd "+oDOM+", "+sEvent+", "+fCall);
      return; // -- break --
    }

    var sMethod = LiteGraph.pointerevents_method;
    var sEvent = sEvIn;

    // UNDER CONSTRUCTION
    // convert pointerevents to touch event when not available
    if (sMethod == "pointer" && !window.PointerEvent) {
      console.warn("sMethod=='pointer' && !window.PointerEvent");
      console.log("Converting pointer[" + sEvent + "] : down move up cancel enter TO touchstart touchmove touchend, etc ..");
      switch (sEvent) {
        case "down": {
          sMethod = "touch";
          sEvent = "start";
          break;
        }
        case "move": {
          sMethod = "touch";
          //sEvent = "move";
          break;
        }
        case "up": {
          sMethod = "touch";
          sEvent = "end";
          break;
        }
        case "cancel": {
          sMethod = "touch";
          //sEvent = "cancel";
          break;
        }
        case "enter": {
          console.log("debug: Should I send a move event?"); // ???
          break;
        }
        // case "over": case "out": not used at now
        default: {
          console.warn("PointerEvent not available in this browser ? The event " + sEvent + " would not be called");
        }
      }
    }

    switch (sEvent) {
      //both pointer and move events
      case "down": case "up": case "move": case "over": case "out": case "enter":
        {
          oDOM.addEventListener(sMethod + sEvent, fCall, capture);
        }
      // only pointerevents
      case "leave": case "cancel": case "gotpointercapture": case "lostpointercapture":
        {
          if (sMethod != "mouse") {
            return oDOM.addEventListener(sMethod + sEvent, fCall, capture);
          }
        }
      // not "pointer" || "mouse"
      default:
        return oDOM.addEventListener(sEvent, fCall, capture);
    }
  }

  pointerListenerRemove(oDOM, sEvent, fCall, capture = false) {
    if (!oDOM || !oDOM.removeEventListener || !sEvent || typeof fCall !== "function") {
      //console.log("cant pointerListenerRemove "+oDOM+", "+sEvent+", "+fCall);
      return; // -- break --
    }
    switch (sEvent) {
      //both pointer and move events
      case "down": case "up": case "move": case "over": case "out": case "enter":
        {
          if (LiteGraph.pointerevents_method == "pointer" || LiteGraph.pointerevents_method == "mouse") {
            oDOM.removeEventListener(LiteGraph.pointerevents_method + sEvent, fCall, capture);
          }
        }
      // only pointerevents
      case "leave": case "cancel": case "gotpointercapture": case "lostpointercapture":
        {
          if (LiteGraph.pointerevents_method == "pointer") {
            return oDOM.removeEventListener(LiteGraph.pointerevents_method + sEvent, fCall, capture);
          }
        }
      // not "pointer" || "mouse"
      default:
        return oDOM.removeEventListener(sEvent, fCall, capture);
    }
  }
}

//timer that works everywhere
if (typeof performance != "undefined") {
  LiteGraph.getTime = performance.now.bind(performance);
} else if (typeof Date != "undefined" && Date.now) {
  LiteGraph.getTime = Date.now.bind(Date);
} else if (typeof process != "undefined") {
  LiteGraph.getTime = function () {
    var t = process.hrtime();
    return t[0] * 0.001 + t[1] * 1e-6;
  };
} else {
  LiteGraph.getTime = function getTime() {
    return new Date().getTime();
  };
}

if (typeof window != "undefined" && !window["requestAnimationFrame"]) {
  window.requestAnimationFrame =
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}

//API *************************************************
//like rect but rounded corners
if (typeof (window) != "undefined" && window.CanvasRenderingContext2D && !window.CanvasRenderingContext2D.prototype.roundRect) {
  window.CanvasRenderingContext2D.prototype.roundRect = function (
    x,
    y,
    w,
    h,
    radius,
    radius_low
  ) {
    var top_left_radius = 0;
    var top_right_radius = 0;
    var bottom_left_radius = 0;
    var bottom_right_radius = 0;

    if (radius === 0) {
      this.rect(x, y, w, h);
      return;
    }

    if (radius_low === undefined)
      radius_low = radius;

    //make it compatible with official one
    if (radius != null && radius.constructor === Array) {
      if (radius.length == 1)
        top_left_radius = top_right_radius = bottom_left_radius = bottom_right_radius = radius[0];
      else if (radius.length == 2) {
        top_left_radius = bottom_right_radius = radius[0];
        top_right_radius = bottom_left_radius = radius[1];
      }
      else if (radius.length == 4) {
        top_left_radius = radius[0];
        top_right_radius = radius[1];
        bottom_left_radius = radius[2];
        bottom_right_radius = radius[3];
      }
      else
        return;
    }
    else //old using numbers
    {
      top_left_radius = radius || 0;
      top_right_radius = radius || 0;
      bottom_left_radius = radius_low || 0;
      bottom_right_radius = radius_low || 0;
    }

    //top right
    this.moveTo(x + top_left_radius, y);
    this.lineTo(x + w - top_right_radius, y);
    this.quadraticCurveTo(x + w, y, x + w, y + top_right_radius);

    //bottom right
    this.lineTo(x + w, y + h - bottom_right_radius);
    this.quadraticCurveTo(
      x + w,
      y + h,
      x + w - bottom_right_radius,
      y + h
    );

    //bottom left
    this.lineTo(x + bottom_right_radius, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bottom_left_radius);

    //top left
    this.lineTo(x, y + bottom_left_radius);
    this.quadraticCurveTo(x, y, x + top_left_radius, y);
  };
}//if