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
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './xgd-chapter-item.js';
import './xgd-page-item.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import {XGDChapter} from './xgd-chapter.js';
/**
 * `xgd-table-of-contents`
 * Provides a table of contents for use in a document library or other such use.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XGDTableOfContents extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }

      #toc {
        @apply --layout-vertical;
        @apply --layout-start-justified;
      }
    </style>
    <div class="content">
      <div class="search">
        <paper-input label="Search Contents" value="{{_searchTerm}}">
          <iron-icon icon="icons:search" slot="prefix"></iron-icon>
          <iron-icon icon="icons:clear" slot="suffix" on-click="_clearSearch"></iron-icon>
        </paper-input>
      </div>
      <div class="container">
        <paper-toggle-button checked="" on-click="_handleToggle">[[toggleState]]</paper-toggle-button>
        <div id="toc">
        </div>
      </div>
    </div>
`;
  }

  static get is() { return 'xgd-table-of-contents'; }
  static get properties() {
    return {
      _searchTerm: {
        type: String,
        observer: "_searchTable"
      },
      _tableOfContents: {
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
   * Fired when a user selects a page.
   * @event xgd-page-selection
   * @param {Event} event 
   *
   * The structure of the event is as follows:
   * @param {Object} detail {
   *      @param {String} Title The title of the page
   *      @param {String} Link Link to the page.
   * }
   */

  constructor() {
    super();
    afterNextRender(this, function () {
      window.addEventListener("xgd-page-selection", function (event) {
        this.SelectPage(event.detail.Link);
      }.bind(this));
    });
  }
  /**
  * Clear the search box.
  * @param {Event} event
  */
  _clearSearch(event) {
    this.set('_searchTerm', "");
  }

  /**
  * Search the table of contents.
  * @param {String} term
  */
  _searchTable(term) {
    for (var x = 0; x < this._tableOfContents.length; x++) {
      if (this._tableOfContents[x].HandleSearch) {
        this._tableOfContents[x].HandleSearch(term, true);
      }
    }
  }

  /**
  * Select a particular page.
  * @param {String} pagelink
  */
  SelectPage(pagelink) {
    for (var x = 0; x < this._tableOfContents.length; x++) {
      if (this._tableOfContents[x].SelectLink) {
        this._tableOfContents[x].SelectLink(pagelink, true);
      }
    }
  }

  /**
  * Select a particular chapter.
  * @param {String} title
  */
  SelectChapter(title) {
    for (var x = 0; x < this._tableOfContents.length; x++) {
      if (this._tableOfContents[x].SelectChapter) {
        this._tableOfContents[x].SelectChapter(title, true);
      }
    }
  }

  /**
  * Handles the even from the toggle button.
  * @param {Event} event
  */
  _handleToggle(event) {
    var open = event.target.checked;
    this._toggleMenu(open);
  }

  /**
  * Toggle expand/collapse of the table of contents.
  * @param {Event} event
  */
  _toggleMenu(open) {
    for (var x = 0; x < this._tableOfContents.length; x++) {
      if (this._tableOfContents[x].ShowMenu) {
        this._tableOfContents[x].ShowMenu(open, true);
      }
    }
  }
  /**
  * Set the Table Of Contents Data.
  * @param {Array}(XGDChapter) toc
  */
  LoadTableOfContents(toc) {
    this.$.toc.innerHTML = "";
    for (var x = 0; x < toc.Chapters.length; x++) {
      if (XGDChapter.exists(toc.Chapters[x].Link)) {
        var link = document.createElement("xgd-page-item");
        link.linkicon = this.linkicon;
        link.processChapter(toc.Chapters[x]);
        this.$.toc.append(link);
        this.push("_tableOfContents", link);
      } else {
        var chapter = document.createElement("xgd-chapter-item");
        chapter.closed = this.closed;
        chapter.opened = this.opened;
        chapter.linkicon = this.linkicon;
        chapter.processChapter(toc.Chapters[x]);
        this.$.toc.append(chapter);
        this.push("_tableOfContents", chapter);
      }
    }
    afterNextRender(this, function () {
      this._toggleMenu(false);
    });
  }
}

window.customElements.define(XGDTableOfContents.is, XGDTableOfContents);
