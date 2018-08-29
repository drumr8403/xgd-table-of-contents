/**
@license
Copyright (c) 2018 XGDFalcon LLC. All rights reserved.
This code may only be used under the MIT style license found at https://github.com/XGDElements/xgd-table-of-contents/blob/master/LICENSE
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
export class XGDChapter {
  constructor(source) {
    if (XGDChapter.exists(source)) {
      this.Title = source.Title;
      this.Chapters = source.Chapters;
      this.Link = source.Link;
      this.Element = source.Element;
    } else {
      this.Title = "NO TITLE";
      this.Chapters = [];
      this.Link = ""
    }
  }
  /** Get an identifier for this chapter object */
  GetIdentifier() {
    if (exists(Link)) {
      var start = Link.lastIndexOf('/') + 1;
      var end = Link.length;
      var link = Link.replace("#", "");
      return link.substring(start, end);
    } else {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
  }
  /** Compare this object with a specific term */
  Compare(term) {
    if (XGDChapter.exists(this.Link)) {
      console.log(term);
      return this.Title.toUpperCase().indexOf(term.toUpperCase()) !== -1;
    } else {
      return true;
    }
  }
  /** 
   * Determines if the object actually exists
   *
   * @param Object item
   */
  static exists(item) {
    return (typeof (item) !== 'undefined' && item !== null && item !== "");
  }

  /**
   * Recursively searches for a link and opens all parent chapters.
   * @param {String} Link Link to search for.
   */
  static findLink(chapter, Link, chapters) {
    for(const item of chapter.Chapters) {
      if(item.Link) {
        if(item.Link === Link && (!chapter.Element || chapter.Element._hidden)) {
          for(const chapter2 of chapters) {
            chapter2.Element._toggleVisibility();
          }
        }
      } else {
        chapters.push(item);
        XGDChapter.findLink(item, Link, chapters);
      }
    }
  }
}