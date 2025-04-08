import { defineStore } from 'pinia'

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [],
    currentGroupId: null
  }),

  getters: {
    getCurrentGroup: (state) => {
      return state.groups.find(g => g.id === state.currentGroupId) || null
    }
  },

  actions: {
    createGroup(name) {
      const newGroup = {
        id: Date.now().toString(),
        name,
        members: [],
        expenses: []
      }
      this.groups.push(newGroup)
      return newGroup
    },

    addMember(groupId, name) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        const newMember = {
          id: Date.now().toString(),
          name
        }
        group.members.push(newMember)
      }
    },

    removeMember(groupId, memberId) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        group.members = group.members.filter(m => m.id !== memberId)
      }
    },

    updateMember(groupId, memberId, updatedMember) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        const memberIndex = group.members.findIndex(m => m.id === memberId)
        if (memberIndex !== -1) {
          group.members[memberIndex] = { ...group.members[memberIndex], ...updatedMember }
        }
      }
    },

    addExpense(groupId, expense) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        group.expenses.push(expense)
      }
    },

    removeExpense(groupId, expenseId) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        group.expenses = group.expenses.filter(e => e.id !== expenseId)
      }
    },

    updateExpense(groupId, expenseId, updatedExpense) {
      const group = this.groups.find(g => g.id === groupId)
      if (group) {
        const expenseIndex = group.expenses.findIndex(e => e.id === expenseId)
        if (expenseIndex !== -1) {
          group.expenses[expenseIndex] = { ...group.expenses[expenseIndex], ...updatedExpense }
        }
      }
    },

    setCurrentGroup(groupId) {
      this.currentGroupId = groupId
    }
  }
}) 