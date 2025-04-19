// Import the necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { get, getDatabase, ref, set, update } from "firebase/database";

// Load Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

/**
 * Creates a new group in Realtime Database.
 * @param {Object} group - The group data to add.
 * @returns {Promise<string>} - The ID of the newly added group.
 */
export function fireBaseCreateGroup(group) {
  try {
    if (!group || typeof group !== 'object') {
      throw new Error('Invalid group data');
    }

    set(ref(database, 'groups/' + group.id), {
      ...group,
      createdAt: new Date().toUTCString()
    });

    return group.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

/**
 * Adds a member to a group in Realtime Database.
 * @param {string} groupId - The ID of the group.
 * @param {Object} member - The member data to add.
 */
export function fireBaseAddMember(groupId, member) {
  try {
    if (!groupId || !member || typeof member !== 'object') {
      throw new Error('Invalid groupId or member data');
    }

    const memberRef = ref(database, `groups/${groupId}/members/${member.id}`);
    set(memberRef, member);
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
}

/**
 * Removes a member from a group in Realtime Database.
 * @param {string} groupId - The ID of the group.
 * @param {string} memberId - The ID of the member to remove.
 */
export function fireBaseRemoveMember(groupId, memberId) {
  try {
    if (!groupId || !memberId) {
      throw new Error('Invalid groupId or memberId');
    }

    const memberRef = ref(database, `groups/${groupId}/members/${memberId}`);
    update(memberRef, { isDeleted: true });
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}

/**
 * Adds an expense to a group in Realtime Database.
 * @param {string} groupId - The ID of the group.
 * @param {Object} expense - The expense data to add.
 */
export function fireBaseAddExpense(groupId, expense) {
  try {
    if (!groupId || !expense || typeof expense !== 'object') {
      throw new Error('Invalid groupId or expense data');
    }

    const newExpenseRef = ref(database, `groups/${groupId}/expenses/${expense.id}`);
    set(newExpenseRef, expense);
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

/**
 * Removes an expense from a group in Realtime Database.
 * @param {string} groupId - The ID of the group.
 * @param {string} expenseId - The ID of the expense to remove.
 */
export function fireBaseRemoveExpense(groupId, expenseId) {
  try {
    if (!groupId || !expenseId) {
      throw new Error('Invalid groupId or expenseId');
    }

    const expenseRef = ref(database, `groups/${groupId}/expenses/${expenseId}`);
    set(expenseRef, null);
  } catch (error) {
    console.error('Error removing expense:', error);
    throw error;
  }
}

/**
 * Updates an expense in a group in Realtime Database.
 * @param {string} groupId - The ID of the group.
 * @param {string} expenseId - The ID of the expense to update.
 * @param {Object} updatedExpense - The updated expense data.
 */
export function fireBaseUpdateExpense(groupId, expenseId, updatedExpense) {
  try {
    if (!groupId || !expenseId || !updatedExpense || typeof updatedExpense !== 'object') {
      throw new Error('Invalid groupId, expenseId, or updatedExpense data');
    }

    const expenseRef = ref(database, `groups/${groupId}/expenses/${expenseId}`);
    set(expenseRef, updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

/**
 * Deletes a group from Realtime Database.
 * @param {string} groupId - The ID of the group to delete.
 */
export function fireBaseRemoveGroup(groupId) {
  try {
    if (!groupId) {
      throw new Error('Invalid groupId');
    }

    const groupRef = ref(database, `groups/${groupId}`);
    set(groupRef, null);
  } catch (error) {
    console.error('Error removing group:', error);
    throw error;
  }
}

export async function fireBaseGetMembers(groupId) {
  try {
    if (!groupId) {
      throw new Error('Invalid groupId');
    }

    const membersRef = ref(database, `groups/${groupId}/members`);
    const snapshot = await get(membersRef);
    if (snapshot.exists()) {
      const members = snapshot.val();
      return Object.entries(members).map(([id, data]) => ({
        id,
        ...data
      }));
    } else {
      console.log('No members found');
      return [];
    }
  } catch (error) {
    console.error('Error getting members:', error);
    throw error;
  }
}