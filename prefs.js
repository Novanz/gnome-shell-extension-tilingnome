const GLib           = imports.gi.GLib;
const Gio            = imports.gi.Gio;
const Gtk            = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;

let _settings;
let _bindings;

function prefsWidget(gs) {
  const widget = new Gtk.Box({
    expand: true,
    halign: Gtk.Align.CENTER,
    valign: Gtk.Align.CENTER,
    margin: 6,
    spacing: 6,
    orientation: Gtk.Orientation.VERTICAL
  });
  gs.settings_schema.list_keys().forEach(name => {
    const key = gs.settings_schema.get_key(name);
    const box = new Gtk.Box({hexpand: true});
    widget.add(box);
    box.pack_start(new Gtk.Label({
      label:        key.get_summary(),
      tooltip_text: key.get_description(),
    }), false, false, 6);
    const val = new Gtk.Entry({text: gs.get_value(name).print(false)});
    const typ = key.get_value_type();
    val.connect('changed', () => {
      try {
        gs.set_value(name, GLib.Variant.parse(typ, val.text, null, null));
      } catch (_) {}
    });
    box.pack_end(val, false, false, 6);
    box.pack_end(new Gtk.Label({label: '@' + typ.dup_string()}), false, false, 6);
  });
  return widget;
}

function buildPrefsWidget() {
  const main = new Gtk.Notebook({});
  main.append_page(prefsWidget(_settings), new Gtk.Label({label: "Preferences"}));
  main.append_page(prefsWidget(_bindings), new Gtk.Label({label: "Keybindings"}));
  main.show_all();
  return main;
}

function init() {
  const me = ExtensionUtils.getCurrentExtension();
  const sr = Gio.SettingsSchemaSource.new_from_directory(
      me.dir.get_path(), Gio.SettingsSchemaSource.get_default(), false);
  const ss = me.metadata['settings-schema'];
  _settings = new Gio.Settings({
    settings_schema: sr.lookup(ss, true)
  });
  _bindings = new Gio.Settings({
    settings_schema: sr.lookup(ss + '.keybindings', true)
  });
}
