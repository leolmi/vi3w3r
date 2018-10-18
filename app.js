'use strict';

(function(w) {

  const container = document.getElementById('bookmark');
  const error = document.getElementById('error');
  const loader = document.getElementById('loader');
  const body = document.getElementsByTagName("BODY")[0];

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
          _class(container, 'md-mono', !lockstyle);
          _class(body, 'md-text-opened', true);
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

  w.addEventListener("dragover",function(e){
    e = e || event;
    e.preventDefault();
  },false);
  w.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
    _load(((e.dataTransfer||{}).files||[])[0]);
  },false);

})(this);