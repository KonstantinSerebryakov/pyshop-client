import { computed, readonly, ref, watch } from 'vue';

export enum INPUT_MESSAGE_TYPE {
  ERROR = 'ERROR',
  INFO = 'INFO',
}

export function useInputMessage() {
  const _messageType = ref(INPUT_MESSAGE_TYPE.ERROR);
  const _message = ref('');
  const _isShowMessage = ref(false);

  function showError(message?: string) {
    _messageType.value = INPUT_MESSAGE_TYPE.ERROR;
    if (message) {
      _message.value = message;
    }
    show();
  }

  function showInfo(message?: string) {
    _messageType.value = INPUT_MESSAGE_TYPE.ERROR;
    if (message) {
      _message.value = message;
    }
    show();
  }

  function show() {
    _isShowMessage.value = true;
  }

  function hide() {
    _isShowMessage.value = false;
  }

  return {
    type: _messageType,
    message: _message,
    isShowMessage: readonly(_isShowMessage),
    showError,
    showInfo,
    show,
    hide,
  };
}
