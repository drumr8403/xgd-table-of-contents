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
import '@polymer/paper-tooltip/paper-tooltip.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import {XGDChapter} from './xgd-chapter.js';

/**
 * `xgd-page-item`
 * Provides a table of contents for use in a document library or other such use.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XGDPageItem extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        z-index: 0;
      }

      #content {
        @apply --layout-horizontal;
        @apply --layout-start-justified;
        cursor: pointer;
        background-color: transparent;
        color: var(--primary-text-color, #000);
        font-style: normal;
      }

      .title {
        @apply --layout-flex;
        font-size: var(--toc-font-size, 1em);
        text-decoration: none;
        height: auto;
        min-height: 1em;
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

    <div id="content">
      <iron-icon id="icon" icon\$="[[linkicon]]"></iron-icon>
      <span id="pagename" class="title">[[chapter.Title]]</span>
    </div>
    <paper-tooltip animation-delay="200" for="pagename" position="top">[[chapter.Title]]</paper-tooltip>
`;
  }

  static get is() { return 'xgd-page-item'; }
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
      /** Icon for links */
      linkicon: {
        type: String,
        value: "icons:link"
      }
    };
  }

  constructor() {
    super();
    afterNextRender(this, function () {
      this.$.content.addEventListener('click', this._handleClick.bind(this));
    });
  }

  /**
   * Select this element if the link matches
   * @param {String} link 
   */
  SelectLink(link) {
    if (link === this.chapter.Link) {
      this.$.content.className = "selected";
      if (this.parentNode.parentNode.host) {
        this.parentNode.parentNode.host._openParent();
      }
    } else {
      this.$.content.className = "";
    }
  }
  /**
   * Handle clicking this item
   *
   * @param {String} term
   */
  _handleClick(event) {
    var chapter = new XGDChapter(this.chapter);
    window.dispatchEvent(new CustomEvent("xgd-page-selection", { detail: chapter, bubbles: true }));
  }

  /**
   * Handle a table of contents search
   *
   * @param {String} term
   */
  HandleSearch(term) {
    if (!this.chapter.Compare(term)) {
      this.style.display = "none";
    } else {
      this.style.display = "block";
    }
  }

  /**
  * Process a chapter.
  * @param {XGDChapter} chapter
  */
  processChapter(chapter) {
    this.chapter = new XGDChapter(chapter);
  }
}

window.customElements.define('xgd-page-item', XGDPageItem);
