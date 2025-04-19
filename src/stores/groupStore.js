import { defineStore } from 'pinia';
import { fireBaseCreateGroup, fireBaseAddMember, fireBaseRemoveMember, fireBaseAddExpense, fireBaseRemoveGroup, fireBaseGetMembers } from '../firebase';

export const useGroupStore = defineStore('group', {
  state: () => {
    const savedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    const savedCurrentGroupId = localStorage.getItem('currentGroupId');
    return {
      groups: savedGroups,
      currentGroupId: savedCurrentGroupId
    };
  },

  getters: {
    getCurrentGroup: (state) => {
      return state.groups.find(g => g.id === state.currentGroupId) || null;
    }
  },

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('groups', JSON.stringify(this.groups));
      localStorage.setItem('currentGroupId', this.currentGroupId);
    },

    createGroup(name) {
      const newGroup = {
        id: Date.now().toString(),
        name,
        members: [],
        expenses: []
      };
      this.groups.push(newGroup);
      this.saveToLocalStorage();
      fireBaseCreateGroup(newGroup);
      return newGroup;
    },

    addMember(groupId, name) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        const newMember = {
          id: Date.now().toString(),
          name,
          isDeleted: false
        };
        group.members.push(newMember);
        this.saveToLocalStorage();
        fireBaseAddMember(groupId, newMember);
        return newMember;
      }
    },

    removeMember(groupId, memberId) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        const member = group.members.find(m => m.id === memberId);
        if (member) {
          member.isDeleted = true;
          this.saveToLocalStorage();
          fireBaseRemoveMember(groupId, memberId);
        }
      }
    },

    async getActiveMembers(groupId) {
      const members = await fireBaseGetMembers(groupId);
      if (members) {
        return members.filter(m => !m.isDeleted);
      }
      return [];
    },

    updateMember(groupId, memberId, updatedMember) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        const memberIndex = group.members.findIndex(m => m.id === memberId);
        if (memberIndex !== -1) {
          group.members[memberIndex] = { ...group.members[memberIndex], ...updatedMember };
          this.saveToLocalStorage();
          fireBaseAddMember(groupId, group.members[memberIndex]);
        }
      }
    },

    addExpense(groupId, expense) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        const newExpense = {
          id: Date.now().toString(),
          ...expense
        };
        group.expenses.push(newExpense);
        this.saveToLocalStorage();
        fireBaseAddExpense(groupId, newExpense);
        return newExpense;
      }
    },

    removeExpense(groupId, expenseId) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        group.expenses = group.expenses.filter(e => e.id !== expenseId);
        this.saveToLocalStorage();
        fireBaseRemoveExpense(groupId, expenseId);
      }
    },

    updateExpense(groupId, expenseId, updatedExpense) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        const expenseIndex = group.expenses.findIndex(e => e.id === expenseId);
        if (expenseIndex !== -1) {
          group.expenses[expenseIndex] = { ...group.expenses[expenseIndex], ...updatedExpense };
          this.saveToLocalStorage();
          fireBaseAddExpense(groupId, group.expenses[expenseIndex]);
        }
      }
    },

    setCurrentGroup(groupId) {
      this.currentGroupId = groupId;
      this.saveToLocalStorage();
    },

    removeGroup(groupId) {
      this.groups = this.groups.filter(group => group.id !== groupId);
      this.saveToLocalStorage();
      fireBaseRemoveGroup(groupId);
    }
  }
});