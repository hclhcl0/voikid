/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./ts-loader.cjs');
const { profileScope, profileStorageKeys, profilesForScope, selectProfile } = load('src/lib/profileScope.ts');
const profile = (id, extra = {}) => ({ id, name: id, avatar: '🐰', gradeId: 'lop4', color: 'orange', createdAt: '2026-10-06', ...extra });

test('admin uses its own scope even when a parent session is also present', () => {
  assert.equal(profileScope(undefined, true), 'admin');
  assert.equal(profileScope('parent-one', true), 'admin');
  assert.equal(profileScope('parent-one', false), 'account:parent-one');
  assert.equal(profileScope(undefined, false), 'guest');
});

test('account and active child caches do not share keys with guests or other parents', () => {
  const scopes = ['guest', 'admin', 'account:one', 'account:two'];
  assert.equal(new Set(scopes.map(s => profileStorageKeys(s).profiles)).size, 4);
  assert.equal(new Set(scopes.map(s => profileStorageKeys(s).active)).size, 4);
  assert.deepEqual(profileStorageKeys('guest'), { profiles: 'vocakids_profiles_v1', active: 'vocakids_active_profile_id' });
});

test('guest migration keeps local progress IDs without restoring cached family children', () => {
  const input = [profile('default'), profile('local-one'), profile('student_old'), profile('owned', { ownerId: 'parent' }), profile('sql-owned', { owner_id: 'parent' }), null];
  assert.deepEqual(profilesForScope(input, 'guest').map(p => p.id), ['default', 'local-one']);
});

test('signed-in accounts never acquire a sample child, including an empty admin', () => {
  assert.deepEqual(profilesForScope([profile('default'), profile('student_real')], 'admin').map(p => p.id), ['student_real']);
  assert.deepEqual(profilesForScope([profile('default')], 'account:parent'), []);
  assert.equal(selectProfile([], 'default'), null);
  assert.deepEqual(profilesForScope({ profiles: [] }, 'admin'), []);
  assert.deepEqual(profilesForScope([{ id: 'bad' }], 'admin'), []);
});

test('restores only a selection that still belongs to the authoritative account list', () => {
  const children = [profile('student_first'), profile('student_second')];
  assert.equal(selectProfile(children, 'student_second').id, 'student_second');
  assert.equal(selectProfile(children, 'other-family-child').id, 'student_first');
  assert.equal(selectProfile(children, 'default').id, 'student_first');
});
