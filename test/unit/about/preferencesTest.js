/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
/* global describe, before, beforeEach, after, it */

const mockery = require('mockery')
const {mount} = require('enzyme')
const sinon = require('sinon')
const assert = require('assert')
const fakeElectron = require('../lib/fakeElectron')
let Preferences, appActions, SettingItemIcon
require('../braveUnit')

describe('Preferences component unittest', function () {
  before(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })
    mockery.registerMock('../../less/switchControls.less', {})
    mockery.registerMock('../../less/about/preferences.less', {})
    mockery.registerMock('../../less/forms.less', {})
    mockery.registerMock('../../less/button.less', {})
    mockery.registerMock('../../node_modules/font-awesome/css/font-awesome.css', {})
    mockery.registerMock('../../../extensions/brave/img/caret_down_grey.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_general.svg', 'browser_prefs_general.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_search.svg', 'browser_prefs_search.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_tabs.svg', 'browser_prefs_tabs.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_extensions.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_plugins.svg', 'browser_prefs_plugins.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_security.svg', 'browser_prefs_security.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_shields.svg', 'browser_prefs_shields.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_payments.svg', 'browser_prefs_payments.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_sync.svg', 'browser_prefs_sync.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_advanced.svg', 'browser_prefs_advanced.svg')
    mockery.registerMock('../../../extensions/brave/img/ledger/icon_settings.svg')
    mockery.registerMock('../../../extensions/brave/img/ledger/icon_history.svg')
    mockery.registerMock('../../../../extensions/brave/img/ledger/verified_green_icon.svg')
    mockery.registerMock('../../../../extensions/brave/img/ledger/verified_white_icon.svg')
    mockery.registerMock('../../../../extensions/brave/img/ledger/icon_remove.svg')
    mockery.registerMock('../../../../extensions/brave/img/ledger/icon_pin.svg')
    mockery.registerMock('../../../../extensions/brave/img/ledger/uphold_logo_small.png')
    mockery.registerMock('../../../../extensions/brave/img/ledger/uphold_logo_medium.png')
    mockery.registerMock('../../../../extensions/brave/img/private_internet_access.png')
    mockery.registerMock('../../../../extensions/brave/img/private_internet_access_2x.png')
    mockery.registerMock('../../../../extensions/brave/img/coinbase_logo.png')
    mockery.registerMock('../../../../extensions/brave/img/android_download.svg')
    mockery.registerMock('../../../../extensions/brave/img/ios_download.svg')
    mockery.registerMock('../../img/icon_pencil.svg')
    mockery.registerMock('../../../../img/toolbar/stoploading_btn.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_payments_on.svg')
    mockery.registerMock('../../../extensions/brave/img/preferences/browser_prefs_payments_off.svg')
    // Mocks the icon used in payments tab
    mockery.registerMock('../../../extensions/brave/img/ledger/cryptoIcons/BAT_icon.svg')
    // Mocks the icons used in addFundsDialog and its steps
    mockery.registerMock('../../../../../../extensions/brave/img/ledger/wallet_icon.svg')
    mockery.registerMock('../../../../../../extensions/brave/img/ledger/cryptoIcons/ETH_icon.svg')
    mockery.registerMock('../../../../../../extensions/brave/img/ledger/cryptoIcons/BTC_icon.svg')
    mockery.registerMock('../../../../../../extensions/brave/img/ledger/cryptoIcons/LTC_icon.svg')
    mockery.registerMock('../../../../../../extensions/brave/img/ledger/cryptoIcons/BAT_icon.svg')
    // Mock image from addFundsDialogFooter
    mockery.registerMock('../../../../../extensions/brave/img/ledger/uphold_logo_medium.png')

    window.chrome = fakeElectron
    window.CustomEvent = {}

    Preferences = require('../../../js/about/preferences').AboutPreferences
    SettingItemIcon = require('../../../app/renderer/components/common/settings').SettingItemIcon
    appActions = require('../../../js/actions/appActions')
  })
  after(function () {
    mockery.disable()
  })

  describe('loads', function () {
    before(function () {
      this.eventMap = {}
      sinon.stub(window, 'addEventListener', (event, cb) => {
        this.eventMap[event] = cb
      })
      window.CustomEvent = {}
      this.result = mount(Preferences)
    })

    beforeEach(function () {
      window.location.hash = ''
    })

    it('Changes pref pane on popstate event', function () {
      assert.equal(this.result.find('[data-test-id="generalSettings"]').length, 1)
      assert.equal(this.result.find('[data-test-id="searchSettings"]').length, 0)
      // emit a fake popstate event
      window.location.hash = 'search'
      this.eventMap.popstate()
      assert.equal(this.result.find('[data-test-id="generalSettings"]').length, 0)
      assert.equal(this.result.find('[data-test-id="searchSettings"]').length, 1)
    })

    it('Changes pref pane by hash on mount', function () {
      this.result = mount(Preferences)
      assert.equal(this.result.find('[data-test-id="generalSettings"]').length, 1)
      assert.equal(this.result.find('[data-test-id="searchSettings"]').length, 0)
      window.location.hash = 'search'
      this.result = mount(Preferences)
      assert.equal(this.result.find('[data-test-id="generalSettings"]').length, 0)
      assert.equal(this.result.find('[data-test-id="searchSettings"]').length, 1)
    })

    it('Allows state change from query string in hash', function () {
      this.result = mount(Preferences)
      assert.equal(this.result.find('[data-test-id="generalSettings"]').length, 1)
      assert.equal(this.result.find('[data-test-id="paymentsContainer"]').length, 0)
      assert.equal(this.result.node.state.ledgerBackupOverlayVisible, false)
      window.location.hash = 'payments?ledgerBackupOverlayVisible'
      this.result = mount(Preferences)
      assert.equal(this.result.find('[data-test-id="generalSettings"]').length, 0)
      assert.equal(this.result.find('[data-test-id="paymentsContainer"]').length, 1)
      assert.equal(this.result.node.state.ledgerBackupOverlayVisible, true)
    })
  })

  describe('General', function () {
    describe('Default path', function () {
      it('call appActions.defaultDownloadPath when pencil is clicked', function () {
        const spy = sinon.spy(appActions, 'defaultDownloadPath')
        const wrapper = mount(
          <SettingItemIcon
            clickAction={appActions.defaultDownloadPath()}
            position='right'
          />
        )
        wrapper.find('span[data-icon-position="right"]').simulate('click')
        assert.equal(spy.calledOnce, true)
        appActions.defaultDownloadPath.restore()
      })
    })
  })
})
