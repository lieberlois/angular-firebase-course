import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Board, Task } from './board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore
  ) {}

  /**
   * Creates a new board for the current user
   */
  async createBoard(data: Board) {
    const user = await this.fireAuth.currentUser;
    return this.fireStore.collection('boards').add({
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Hello world!', label: 'yellow' }],
    });
  }

  /**
   * Deletes a board
   */
  deleteBoard(boardId: string) {
    return this.fireStore.collection('boards').doc(boardId).delete();
  }

  /**
   * Update tasks
   */
  updateTasks(boardId: string, tasks: Task[]) {
    return this.fireStore.collection('boards').doc(boardId).update({ tasks });
  }

  /**
   * Remove task
   */
  removeTask(boardId: string, task: Task) {
    return this.fireStore
      .collection('boards')
      .doc(boardId)
      .update({ tasks: firebase.firestore.FieldValue.arrayRemove(task) });
  }

  /**
   * Get all boards owned by current user
   */
  getUserBoards() {
    return this.fireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.fireStore
            .collection<Board>('boards', (ref) =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Run a batch write to change the priority of each board for sorting
   */
  sortBoards(boards: Board[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map((b) => db.collection('boards').doc(b.id));

    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}
