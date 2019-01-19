// Copyright 2019 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * @fileoverview The main hterm.org page.
 */

// The latest hterm release that we default to.
const latestRelease = '1.83';
// All hterm releases that may be dynamically selected.
const allReleases = [
  '1.80',
  '1.81',
  '1.82',
  latestRelease,
];
// The current version loaded.
let currentRelease;

/**
 * Various terminal escape sequences used below.
 */
const esc = `\x1b`;
const bel = `\x07`;

const sgr = (...args) => `${esc}[${args.join(';')}m`;
const sgrRgbFg = (...args) => sgr(`38:2:${args.join(':')}`);
const sgrRgbBg = (...args) => sgr(`48:2:${args.join(':')}`);
const normal = sgr(0);
const bold = sgr(1);
const italic = sgr(3);
const underline = sgr(4);

const osc = (...args) => `${esc}]${args.join(';')}${bel}`;
const osc8 = (uri='', params='') => osc(8, params, uri);

function initContent(io) {
  const ver = lib.resource.getData('hterm/changelog/version');
  const date = lib.resource.getData('hterm/changelog/date');
  const pkg = `hterm v${ver} (built on ${date})`;

  let lines = [
    ``,
    `${bold}hterm: a terminal emulator for the web${normal}`,
    ``,
    `hterm is a JS library that provides a terminal emulator.`,
    `It is reasonably fast, correct, and portable across browsers.`,
    ``,
  ];
  lines.forEach((line) => io.println(line));

  const topLine = '\u{23ba}';
  const colorTermFg = sgrRgbFg(0x7a, 0xe9, 0x46);
  const colorTermBg = sgrRgbBg(0x10, 0x37, 0x18);
  lines = [
    `  .--~~~~~~~~~~~~~------.`,
    ` /--===============------\\`,
    ` | |${colorTermBg}${topLine.repeat(15)}${normal}|     |`,
    ` | |${colorTermBg}               ${normal}|     |`,
    ` | |${colorTermBg}      ${colorTermFg}>_<      ${normal}|     |`,
    ` | |${colorTermBg}               ${normal}|     |`,
    ` | |${colorTermBg}_______________${normal}|     |`,
    ` |                   ::::|`,
    ` '======================='`,
    ` //-'-'-'-'-'-'-'-'-'-'-\\\\`,
    `//_'_'_'_'_'_'_'_'_'_'_'_\\\\`,
    `[-------------------------]`,
    `\\_________________________/`,
  ];
  lines.forEach((line) => io.println(' '.repeat(20) + line));
  io.println('');

  const bullet = '\u{2022}';
  let links = [
    ['https://github.com/chromium/hterm/releases/', 'Releases'],
    ['/docs/', 'Documentation'],
    ['/x/contact', 'Contact'],
    ['/x/bugs', 'Bugs & Feature Requests'],
    ['/x/src', 'Source'],
  ];
  links.forEach(([uri, text]) =>
    io.println(` ${bullet} ${underline}${osc8(uri)}${text}${osc8()}${normal}`));
  io.println('');

  io.println('Load older versions for quick testing (opens in new window).');
  allReleases.forEach((ver) => {
    const text = `${ver}`;
    if (ver == currentRelease) {
      io.print(` [${text}]`);
    } else {
      const uri = `${window.location.pathname}?term-version=${ver}`;
      io.print(` ${underline}${osc8(uri)}${text}${osc8()}${normal}`);
    }
  });
  io.println('');
  io.println('');

  lines = [
    `This is a live version of ${pkg}.`,
    `Have fun!`,
  ];
  lines.forEach((line) => io.println(line));
};

function setupHterm() {
  // We don't mark it local so people can play with it in the dev console.
  var term = new hterm.Terminal();

  term.onTerminalReady = function() {
    const io = this.io.push();
    function printPrompt() {
      io.print(
          `${sgrRgbFg(0x33, 0x69, 0xe8)}h` +
          `${sgrRgbFg(0xd5, 0x0f, 0x25)}t` +
          `${sgrRgbFg(0xee, 0xb2, 0x11)}e` +
          `${sgrRgbFg(0x33, 0x69, 0xe8)}r` +
          `${sgrRgbFg(0x00, 0x99, 0x25)}m` +
          `${sgrRgbFg(0xd5, 0x0f, 0x25)}>` +
          `${normal} `
      );
    }

    io.onVTKeystroke = (string) => {
      switch (string) {
        case '\r':
          //io.println('');
          //printPrompt();
          break;
        default:
          io.print(string);
          break;
      }
    };
    io.sendString = io.print;
    initContent(io);
    printPrompt();
    this.setCursorVisible(true);

    this.keyboard.bindings.addBindings({
      // Allow page refreshing.
      'Ctrl-R': 'PASS',
      // Fullscreen shortcut.
      'F11': 'PASS',
    });

    // Just enough to provide an example.
    this.contextMenu.setItems([
      ['Terminal Clear', function() { term.wipeContents(); }],
      ['Terminal Reset', function() { term.reset(); }],
    ]);
  };
  term.decorate(document.querySelector('#terminal'));
  term.installKeyboard();

  // Useful for console debugging.
  window.term_ = term;
}

// Dynamically load the specified version.
function loadVersion(version) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `/dist/${version}/hterm_all.js`;
  script.onload = function() {
    currentRelease = version;
    lib.init(setupHterm);
  };
  script.onerror = function() {
    // Fallback to known version if they specified an invalid one.
    loadVersion(latestRelease);
  };
  document.body.appendChild(script);
}

// Figure out which version to use from the URL query string.
function selectVersion() {
  const params = new URLSearchParams(window.location.search);
  let version = params.get('term-version') || latestRelease;
  if (version.match(/[^a-f0-9.]/)) {
    console.error(`Invalid requested version: ${version}`);
    version = latestRelease;
  }
  loadVersion(version);
}
selectVersion();
