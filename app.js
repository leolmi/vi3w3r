'use strict';

(function(w) {

  const container = document.getElementById('bookmark');
  const error = document.getElementById('error');
  const loader = document.getElementById('loader');
  const BODY = document.getElementsByTagName("BODY")[0];
  const HTML = document.getElementsByTagName('HTML')[0];
  const info = document.getElementById('file-info');
  let tools = false;

  function _manageErr(err) {
    container.innerHTML = '';
    error.innerHTML = err.message;
  }

  const parsers = {
    json: (txt, cb) => {
      try {
        const o = JSON.parse(txt);
        const res = JSON.stringify(o, null, 2);
        cb(null, res);
      } catch (err) {
        cb(err);
      }
    },
    md: (txt, cb) => {
      try {
        const converter = new w.showdown.Converter();
        const res = converter.makeHtml(txt);
        cb(null, res, true);
      } catch (err) {
        cb(err);
      }
    },
    _default: (txt, cb) => cb(null, txt)
  };

  function _class(ele, name, apply) {
    if (!name || !ele) return;
    if (apply) {
      if (!ele.classList.contains(name)) ele.classList.add(name);
    } else {
      if (ele.classList.contains(name)) ele.classList.remove(name);
    }
  }

  function _load(f) {
    const fn = (f||{}).name;
    if (!fn) return;
    error.innerHTML = '';
    const r = new FileReader();
    r.onloadend = function (e) {
      try {
        const pp = fn.lastIndexOf('.');
        const ext = pp>0 ? (fn.substr(pp+1)||'').toLowerCase() : '';
        (parsers[ext]||parsers._default)(e.target.result, (err, res, lockstyle) => {
          if (err) return _manageErr(err);
          container.innerHTML = res;
          info.innerHTML = fn;
          _class(container, 'md-mono', !lockstyle);
          _class(BODY, 'md-text-opened', true);
        });
      } catch(err) {
        _manageErr(err);
      }
    };
    r.onerror = _manageErr;
    r.readAsText(f);
  }

  w.chooseMD = function(e) {
    loader.click();
  };

  w.loadFileMD = function(e) {
    _load(((e.target||{}).files||[])[0]);
  };

  w.printMD = function() {
    w.print();
  };

  w.closeTools = function() {
  //   if (tools) w.toggleMD();
  };

  w.toggleMD = function() {
    tools = !tools;
    _class(BODY, 'md-tools-active', tools);
  };

  w.clearMD = function() {
    container.innerHTML = '<span></span>';
    info.innerHTML = '<span></span>';
    _class(BODY, 'md-text-opened', false);
  };

  w.topMD = function() {
    HTML.scrollTop = 0;
  };

  w.addEventListener("dragover",function(e){
    e = e || event;
    e.preventDefault();
  },false);
  w.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
    _load(((e.dataTransfer||{}).files||[])[0]);
  },false);
  w.addEventListener("scroll",function(e){
    const show = ((((e||{}).target||{}).scrollingElement||{}).scrollTop||0) > 200;
    _class(BODY, 'md-scroll-on', show);
  },false);

})(this);
