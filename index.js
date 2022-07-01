const fetch = require('node-fetch')
const Browser = require('zombie');
const repl = require("repl");

const browser = new Browser();

function help(a) {
    var descriptions = ['\nHexel commands help: \n'];
    for (var thing in a) {
        var desc = a[thing].toString().split('\n')[1].split('// Description: ')[1];
        var usage = a[thing].toString().split('\n')[2].split('// Usage: ')[1];
        descriptions.push('- ' + thing + ' (usage: "' + usage + '"): ' + desc + '\n');
    }
    return descriptions.join('\n') + '\n';
}

var tab = 1
var funcs = {
    visit: (url) => {
        // Description: redirects to a URL
        // Usage: hexel::visit(https://url.here)
        return new Promise((resolve, reject) => {
            browser.visit(url, () => {
                resolve(true)
            });
        })
    },
    reset: () => {
        // Description: refreshes the webpage
        // Usage: hexel::reset()
        browser.visit(browser.location.href, () => {
            resolve(true)
        });
    },
    loadScript: async (url) => {
        // Description: loads a JavaScript script from a URL (developers: use hexel_exports({my_var: other_thing}) in your script to export variables)
        // Usage: hexel::loadScript(https://url.here/example.js)
        console.log('Loading script...', url)
        var res = await fetch(url)
        res = await res.text()
        res = res.replaceAll(`\``, "\\`")
        browser.evaluate(`var hexel_exports = {}
var exs = [];
var exports = 0;
function hexel_export(a){
  for (var v in a) {
    window[v] = a[v];
    exs.push(v);
    exports += 1;
  }
}
  ${res}
  script = undefined;
  console.log("Script loaded. Exported "+exports+" variables into window. (export names: "+exs.join(', ')+")");`);
    },
    newTab: () => {
        // Description: opens a new tab
        // Usage: hexel::newTab()
        browser.open();
        console.log(`Opened new tab. Run "hexel::switchTabs(${browser.tabs.length})" to switch to this tab.`)
    },
    tabs: () => {
        // Description: returns how many tabs there are
        /// Usage: hexel::tabs()
        console.log('There are currently ' + browser.tabs.length + ' tabs open.')
    },
    switchTabs: (t) => {
        // Description: switch tabs
        // Usage: hexel::switchTab(1) (opens up first tab)
        tab = t < 0 ? 1 : tab
        browser.tabs.current = t - 1;
        console.log('Now on tab "' + browser.evaluate('document.title') + "\"")
    },
    closeTab: (t) => {
        // Description: close a tab
        // Usage: hexel::closeTab(2) (closes second tab)
        browser.tabs[t || browser.tabs.current].close()
        browser.tabs.current = t - 1;
        console.log('Now on tab "' + browser.evaluate('document.title') + "\"")
    },
    closeAllTabs: (t) => {
        // Description: close all tabs
        // Usage: hexel::closeAllTabs()
        browser.tabs.closeAll();
        console.log('Closed all tabs.')
    },
    currentTab: () => {
        // Description: gets number of current tab
        // Usage: hexel::currentTab()
        console.log('You are currently on tab ' + tab);
    },
    help: () => {
        // Description: opens help
        // Usage: hexel::help()
        console.log(help(funcs));
    }
}

var f2 = {}

function guessString(s) {
    return s.split("hexel::")[1].split("(")[0]
}

for (var func in funcs) {
    f2[func] = (r) => {
        r = r.replaceAll('\n', '')
        var split = r.split(`(`)
        split = split[1]
        if (split.endsWith(')')) {
            split = split.split(')')[0]
        } else if (split.endsWith(');')) {
            split = split.split(');')[0]
        } else if (split.endsWith(')\n')) {
            split = split.split(')\n')[0]
        } else if (split.endsWvith(');\n')) {
            split = split.split(');\n')[0]
        } else {
            throw new Error('error parsing Hexel code.')
        }
        return funcs[guessString(r)](split)
    }
}

function run(c) {
    return new Promise(async (resolve, reject) => {
        if (f2[guessString(c)]) {
            var h = await f2[guessString(c)](c)
            resolve(h);
        } else {
            console.log('HEXEL ERROR: function either not found or parsing of command failed');
            resolve('failed');
        }
    })
}

function e(res, context, filename, callback) {
    if (!res.includes('hexel::') && (!res.endsWith(')') ||
            !res.endsWith(');'))) {
        try {
            var h = browser.evaluate(res)
            console.log(h)
        } catch (e) {
            console.log(e);
        }
        callback(null)
    } else {
        run(res).then(() => {
            callback(null)
        })
    }
};

browser.visit('about:blank', () => {
    console.log("Welcome to Hexel REPL v1.0.0.\nPress ^C or ^D to exit, type .help for more info or type hexel::help() for help on Hexel commands. \n\nVisit a webpage by running \"hexel::visit(https://google.com)\".\n")
    repl.start({
        prompt: '> ',
        eval: e
    });
});
