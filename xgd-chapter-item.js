/**
@license
Copyright (c) 2018 XGDFalcon LLC. All rights reserved.
This code may only be used under the MIT style license found at https://github.com/XGDElements/xgd-table-of-contents/blob/master/LICENSE
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './xgd-page-item.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import {XGDChapter} from './xgd-chapter.js';
/**
 * `xgd-chapter-item`
 * Provides a table of contents for use in a document library or other such use.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XGDChapterItem extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        @apply --layout-vertical;
        z-index: 0;
      }

      #content {
        @apply --layout-horizontal;
        @apply --layout-start-justified;
      }

      .title {
        @apply --layout-flex;
        font-size: var(--toc-font-size, 1em);
        height: auto;
        min-height: 1em;
      }

      a {
        font-size: var(--toc-font-size, 1em);
        text-decoration: none;
        height: auto;
        min-height: 1em;
      }

      #submenu {
        padding-left: 2ch;
        display: table-cell;
        @apply --layout-vertical;
      }

      iron-icon {
        margin-right: 1ch;
        --iron-icon-width: 36px;
        --iron-icon-height: 36px;
        --iron-icon-fill-color: var(--app-dark-primary-color, #000);
        --iron-icon-stroke-color: var(--app-dark-primary-color, #000);
      }

      #content.selected {
        background-color: var(--app-primary-color, #AA0);
      }

      #content.selected iron-icon {
        --iron-icon-fill-color: var(--app-lite-primary-color, #fff);
        --iron-icon-stroke-color: var(--app-lite-primary-color, #fff);
      }

      #content.selected .title {
        color: var(--light-text-color, #fff);
        font-weight: bold;
      }
    </style>

    <div id="content" on-click="_toggleVisibility">
      <iron-icon icon\$="{{_getIcon(_hidden)}}"></iron-icon>
      <span id="chaptername" class="title">[[chapter.Title]]</span>
    </div>
    <paper-tooltip animation-delay="200" for="chaptername" position="top">[[chapter.Title]]</paper-tooltip>
    <div id="submenu"></div>
`;
  }

  static get is() { return 'xgd-chapter-item'; }
  static get properties() {
    return {
      /** Determines if the submenu is visible */
      _hidden: {
        type: Boolean,
        value: true
      },
      /** Holds chapter information for this element */
      chapter: {
        type: XGDChapter
      },
      /** Holds the sections of this chapter */
      sections: {
        type: Array,
        value: []
      },
      /** Icon for closed folder */
      closed: {
        type: String,
        value: "icons:folder"
      },
      /** Icon for open folder */
      opened: {
        type: String,
        value: "icons:folder-open"
      },
      /** Icon for links */
      linkicon: {
        type: String,
        value: "icons:link"
      }
    };
  }

  /**
   * Handle a table of contents search
   *
   * @param {String} term
   */
  HandleSearch(term, level) {
    if (level) {
      // search children
      for (var x = 0; x < this.sections.length; x++) {
        var section = this.sections[x];
        if (section.tagName.toUpperCase() === "XGD-PAGE-ITEM") {
          section.HandleSearch(term);
        }
      }
    }
  }

  /**
   * Select this element if the title matches
   * @param {String} title 
   */
  SelectChapter(title, level) {
    if (level) {
      // search children
      for (var x = 0; x < this.sections.length; x++) {
        var section = this.sections[x];
        if (section.tagName.toUpperCase() === XGDChapterItem.is.toUpperCase()) {
          section.SelectChapter(title);
        }
      }

    }
    if (title === this.chapter.Title) {
      this.$.content.className = "selected";
      this._openParent();
    } else {
      this.$.content.className = "";
    }
  }

  /**
   * Select a particular link
   *
   * @param {String} link
   */
  SelectLink(link, level) {
    // search children
    if (level) {
      for (var x = 0; x < this.sections.length; x++) {
        var section = this.sections[x];
        section.SelectLink(link);
      }
    }
  }

  /**
   * Internal Use Only
   */
  _openParent() {
    this.ShowMenu(true);
    if (this.parentNode.parentNode.host) {
      this.parentNode.parentNode.host._openParent();
    }
  }

  /**
   * Opens or closes based on the toggle switch
   *
   * @param {Boolean} open
   */
  ShowMenu(open, level) {
    if (level) {
      for (var x = 0; x < this.sections.length; x++) {
        var section = this.sections[x];
        if (section.tagName.toUpperCase() === XGDChapterItem.is.toUpperCase()) {
          section.ShowMenu(open);
        }
      }
    }
    if (open) {
      this.$.submenu.style.display = 'table-cell';
    } else {
      this.$.submenu.style.display = 'none';
    }
    this.set('_hidden', !open);
  }

  /**
   * Get the proper icon if the submenu is visible/invisible
   *
   * @param {Boolean} hidden
   */
  _getIcon(hidden) {
    return hidden ? this.closed : this.opened;
  }

  /**
   * Handles button press to show/hide the submenu
   *
   * @param {Event} event
   */
  _toggleVisibility(event) {
    if (XGDChapter.exists(this.$.submenu)) {
      if (this._hidden) {
        this.$.submenu.style.display = 'table-cell';
        this.$.submenu.innerHTML = "";
        for (var x = 0; x < this.chapter.Chapters.length; x++) {
          if (XGDChapter.exists(this.chapter.Chapters[x].Link)) {
            var link = document.createElement("xgd-page-item");
            link.linkicon = this.linkicon;
            link.processChapter(this.chapter.Chapters[x], true);
            this.$.submenu.appendChild(link);
            this.push('sections', link);
          } else {
            var menu = document.createElement("xgd-chapter-item");
            menu.closed = this.closed;
            menu.opened = this.opened;
            menu.linkicon = this.linkicon;
            menu.processChapter(this.chapter.Chapters[x], true);
            this.$.submenu.appendChild(menu);
            this.push('sections', menu);
          }
        }
      } else {
        this.$.submenu.style.display = 'none';
      }
      this.set('_hidden', !this._hidden);
    }
  }

  /**
  * Process a chapter.
  * @param {XGDChapter} chapter
  */
  processChapter(chapter, toplevel) {
    chapter.Element = this;
    this.chapter = new XGDChapter(chapter);
  }
}

window.customElements.define(XGDChapterItem.is, XGDChapterItem);
