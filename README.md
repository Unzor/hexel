# hexel
Basically a web browser, without the GUI.

# Seriously, what is it?
Hexel is a headless browser REPL that lets you run scripts, navigate the web and switch through tabs using only a CLI.
Hexel allows you to run browser JavaScript offline, so Hexel is useful for every time you don't want do start a webserver or open a browser which takes a lot of RAM.

# How do I use it?
Just run `hexel` and run a script.
For example, a classic "hello world":
```js
console.log("Hello, World!");
```
If you want to make a multi-line script, use `.editor` in the REPL.
For example:
```js
> .editor
// Entering editor mode (Ctrl+D to finish, Ctrl+C to cancel)
var variable = 10;
console.log(variable);
```
Or if you want to visit a webpage, run this:
```
hexel::visit(https://github.com)
```
## All Hexel commands
Here is the entire list of Hexel commands ([source](https://github.com/Unzor/hexel/blob/main/index.js#L18-L97)):
```
- visit (usage: "hexel::visit(https://url.here)"): redirects to a URL

- reset (usage: "hexel::reset()"): refreshes the webpage

- loadScript (usage: "hexel::loadScript(https://url.here/example.js)"): loads a JavaScript script from a URL (developers: use hexel_exports({my_var: other_thing}) in your script to export variables)

- newTab (usage: "hexel::newTab()"): opens a new tab

- tabs (usage: "hexel::tabs()"): returns how many tabs there are

- switchTabs (usage: "hexel::switchTab(1) (opens up first tab)"): switch tabs

- closeTab (usage: "hexel::closeTab(2) (closes second tab)"): close a tab

- closeAllTabs (usage: "undefined"): undefined

- currentTab (usage: "hexel::currentTab()"): gets number of current tab

- help (usage: "hexel::help()"): opens help
```
