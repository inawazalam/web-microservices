import { all } from "redux-saga/effects";
import { userActionWatcher } from "./userSaga";

/**
 * saga to yield all others
 */
export default function* rootSaga() {
  yield all([userActionWatcher()]);
}
