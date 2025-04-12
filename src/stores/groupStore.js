import { defineStore } from 'pinia';

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
      }
    },

    removeMember(groupId, memberId) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        const member = group.members.find(m => m.id === memberId);
        if (member) {
          member.isDeleted = true;
          this.saveToLocalStorage();
        }
      }
    },

    getActiveMembers(groupId) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        return group.members.filter(m => !m.isDeleted);
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
      }
    },

    removeExpense(groupId, expenseId) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        group.expenses = group.expenses.filter(e => e.id !== expenseId);
        this.saveToLocalStorage();
      }
    },

    updateExpense(groupId, expenseId, updatedExpense) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        const expenseIndex = group.expenses.findIndex(e => e.id === expenseId);
        if (expenseIndex !== -1) {
          group.expenses[expenseIndex] = { ...group.expenses[expenseIndex], ...updatedExpense };
          this.saveToLocalStorage();
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
    }
  }
});