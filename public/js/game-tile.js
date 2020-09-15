import { LitElement, css, html } from 'lit-element';

class GameTile extends LitElement {
  static get styles() {
    return css`
      :host {
        position: relative;
        padding: 5px 5px;
        margin: 0 auto;
        width: calc(100% / 4 - 10px);
      }

      @media screen and (max-width: 308px) {
        :host {
          width: calc(100% / 2 - 10px);
        }
      }

      @media screen and (max-width: 154px) {
        :host {
          width: calc(100% / 1 - 10px);
        }
      }

      :host .game-teaser {
        border-radius: 13%;

        box-shadow: 0 1px 5px 0 rgba(0,0,0,0.37);
        transition: box-shadow 0.28s cubic-bezier(0.4,0,0.2,1);

        width: 100%;
        margin-bottom: -6px;
      }

      :host .game-teaser:hover {
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.37);
      }

      :host .archived {
        filter: grayscale(1);
        opacity: 0.5;
      }

      :host .game-placeholder {
        border-radius: 13%;
        width: 100%;
        margin-bottom: -6px;
      }

      :host .new-marker {
        position: absolute;
        left: 0px;
        top: 8px;
        width: 34px;
        height: 18px;

        border-radius: 4px;

        background: #fd4a65;
        color: white;
      }
    `
  }

  static get properties() {
    return {
      appId: { type: String },
      icon: { type: String },
      name: { type: String },
      isNew: { type: Boolean },
      isArchived: { type: Boolean },
      isPlaceholder: { type: Boolean },
      appLink: { type: String }
    }
  }

  constructor() {
    super()

    this.name = ''
    this.isNew = false
    this.isArchived = false
    this.isPlaceholder = false
  }

  firstUpdated(changedProperties) {
    if(this.appId) this.appLink = `https://apps.apple.com/us/app/${this.appId}`
    else if(!this.appLink) this.appLink = 'https://apps.apple.com/us/developer/martin-knopf/id1116381626'
  }

  newMarker() {
    return html`<span class="new-marker">NEW</span>`
  }

  img() {
    let archived = this.isArchived ? 'archived' : ''
    let marker = this.isNew ? this.newMarker() : ''
    return html`
      <img class="game-teaser ${archived}" src="${this.icon}" alt="${this.name}"/>${marker}
    `
  }

  link() {
    if(this.isPlaceholder) {
      return this.placeholder()
    } else if(this.isArchived) {
      return this.img()
    } else {
      return html`
        <a href="${this.appLink}">${this.img()}</a>
      `
    }
  }
  
  render() {
    if(this.isPlaceholder) {
      return html`
        <img class="game-placeholder" src="/img/placeholder_144x144.png"/>
      `
    } else {
      return html`
        <div>
          ${this.link()}
        </div>
      `
    }
  }
}

customElements.define('game-tile', GameTile)
