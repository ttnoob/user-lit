/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
type UserData = {
  email: string
  name: string
  avatar: string
  gender: string
  address: string
  phone: string
}

type RegisterLoginForm = {
  email: string
  password: string
  avatar: string
  name: string
  social_id: string
  social_type: string
  token: string
}

type SocialLoginForm = {
  token: string
  social_type: string
}

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { create, cssomSheet } from 'twind'

// 1. Create separate CSSStyleSheet
const sheet = cssomSheet({ target: new CSSStyleSheet() })

// 2. Use that to create an own twind instance
const { tw } = create({ sheet })
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = [
    css`
      :host {
        height: 18px;
      }
      :host([logged-in]) {
        height: unset;
      }
      #name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
    sheet.target
  ]

  /**
   * The open state of dropdown.
   */
  @property({ type: Boolean })
  open = false;

  /**
   * Login state.
   */
  @property({ type: Boolean, attribute: 'logged-in', reflect: true })
  loggedIn = false;

  /**
   * User detail.
   */
  @property({ type: Object })
  user: UserData = {
    email: '',
    name: '',
    avatar: '',
    gender: '',
    address: '',
    phone: '',
  };

  constructor() {
    super();
  }

  setCookie(name: string, value: string, date: string) {
    let expires = "";
    if (date) {
      expires = "; expires=" + new Date(date).toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  getCookie(name: string): string | null {
    const nameLenPlus = (name.length + 1);
    return document.cookie
      .split(';')
      .map(c => c.trim())
      .filter(cookie => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map(cookie => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null;
  }

  async queryUser(): Promise<UserData> {
    const cookieValue = this.getCookie('token') ?? ''
    const response = fetch('http://localhost:8000/ajax/user/detail-user', {
      // const response = fetch('http://127.0.0.1:4411/api/auth/profile', {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': cookieValue,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(response => { return response.json() })
      .catch(error => { return error })
    type JSONResponse = {
      code?: number,
      data: {
        user: UserData
      }
      error?: string
      message?: string
    }
    const { code, data }: JSONResponse = await response
    if (code === 200) {
      this.user = data?.user
      this.loggedIn = true
    } else {
      this.loggedIn = false
    }
    return response; // parses JSON response into native JavaScript objects
  }

  async register(formData: RegisterLoginForm): Promise<UserData> {
    const response = fetch('http://localhost:8000/ajax/register', {
      // const response = fetch('http://127.0.0.1:4411/api/auth/register', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(response => { return response.json() })
      .catch(error => { return error })
    type JSONResponse = {
      code?: number,
      data: {
        user: UserData,
        token: string,
        expired_at: string,
      }
      error?: string
      message?: string
    }
    const { code, data }: JSONResponse = await response
    if (code === 200) {
      this.user = data?.user
      this.loggedIn = true
      this.setCookie("token", data.token, data.expired_at)
    } else {
      this.loggedIn = false
    }
    return response; // parses JSON response into native JavaScript objects
  }

  async login(formData: RegisterLoginForm): Promise<UserData> {
    const response = fetch('http://localhost:8000/ajax/login', {
      // const response = fetch('http://127.0.0.1:4411/api/auth/login', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(response => { return response.json() })
      .catch(error => { return error })
    type JSONResponse = {
      code?: number,
      data: {
        user: UserData,
        token: string,
        expired_at: string,
      }
      error?: string
      message?: string
    }
    const { code, data }: JSONResponse = await response
    if (code === 200) {
      this.user = data?.user
      this.loggedIn = true
      this.setCookie("token", data.token, data.expired_at)
    } else {
      this.loggedIn = false
    }
    return response; // parses JSON response into native JavaScript objects
  }

  async loginSocial(formData: SocialLoginForm) {
    const response = fetch(`http://localhost:8000/ajax/social-login`, {
      // const response = fetch('http://127.0.0.1:4411/api/auth/login', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(response => { return response.json() })
      .catch(error => {
        console.log(error)
        return error
      })
    type JSONResponse = {
      code?: number,
      data: {
        user: UserData,
        token: string,
        expired_at: string,
      }
      error?: string
      message?: string
    }
    const { code, data }: JSONResponse = await response
    if (code === 200) {
      this.user = data?.user
      this.loggedIn = true
      this.setCookie("token", data.token, data.expired_at)
    } else {
      this.loggedIn = false
    }
    return response; // parses JSON response into native JavaScript objects
  }

  async logout() {
    this.loggedIn = false
    this.setCookie("token", "", "")
    await this.updateComplete
    const modalSwitch = this.getChildById('modal-switch');
    const modalbg = document.getElementById('modal-bg');
    const modalBox = document.getElementById('modal-box');
    modalbg?.addEventListener("click", function() {
        modalBox?.classList.add('hidden')
        modalbg?.classList.add('hidden')
    });
    modalSwitch?.addEventListener("click", function() {
        modalBox?.classList.remove('hidden')
        modalbg?.classList.remove('hidden')
    });
  }

  override render() {
    return this.loggedIn ? html`
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div class="${tw`relative inline-block`}">
        <div>
          <button type="button" class="${tw`inline-flex justify-center w-full shadow-sm py-2 text-sm font-medium focus:outline-none`}" 
              id="menu-button" 
              aria-expanded="true" 
              aria-haspopup="true"
              @click=${this.onButtonClick}>
            <img class="${tw`h-5 w-5 rounded-full border-solid border-2 border-blue-500`}" src="${this.user && this.user.avatar !== "" ? this.user.avatar : '/assets/images/user-default.jpg'}" />
            <!-- Heroicon name: solid/chevron-down -->
            <svg class="${tw`-mr-1 ml-2 h-5 w-5`}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!--
          Dropdown menu, show/hide based on menu state.

          Entering: "transition ease-out duration-100"
            From: "transform opacity-0 scale-95"
            To: "transform opacity-100 scale-100"
          Leaving: "transition ease-in duration-75"
            From: "transform opacity-100 scale-100"
            To: "transform opacity-0 scale-95"
        -->
        <div class="${tw`origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}" 
            role="menu"
            ?hidden=${!this.open}
            aria-orientation="vertical" 
            aria-labelledby="menu-button" 
            tabindex="-1">
          <div class="${tw`py-1`}" role="none">
            <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
            <button type="button" class="${tw`text-gray-700 block w-full text-right px-4 py-2 text-sm focus:outline-none`}" role="menuitem" tabindex="-1" id="name">
              ${this.user ? this.user.name : ''}
            </button>
            <button type="button" class="${tw`text-gray-700 block w-full text-right px-2 py-2 text-sm focus:outline-none`}" role="menuitem" tabindex="-1" id="menu-item-3" @click=${this.logout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    ` : html`<button id="modal-switch">
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>`;
  }

  onButtonClick() {
    this.open = !this.open
  }

  getChildById(id: string) {
    return this.shadowRoot?.getElementById(id);
  }

  onDocClick(event: Event) {
    if (this.open && !event.composedPath().includes(this)) {
      this.open = false
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}

const div1 = document.querySelector('#user');
const myElement = new MyElement();
(async function () {
  await myElement.queryUser();
})()
div1?.appendChild(myElement);

// Add an event listener to the page
function handleClick(event: Event, element: MyElement) {
  // If we didn't click on the custom element, let it
  // know about the event so it can deactivate its span.
  if (event.target !== element) {
    // console.log(`PAGE: Clicked on ${ event.target }. Notifying custom element.`);
    element.onDocClick(event);
  }
}
window.addEventListener('click', (event) => handleClick(event, myElement));