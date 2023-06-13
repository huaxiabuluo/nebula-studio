import { css } from '@emotion/css';

export const genGlobalStyle = (props: Record<string, string>) => css`
  .ant-radio-group.studioTabGroup {
    background: ${props.lightGray};
    border-radius: 20px;
    padding: 4px;
    min-width: 400px;
    display: flex;
    justify-content: center;

    .ant-radio-button-wrapper {
      border-radius: 20px;
      flex: 1;
      text-align: center;
      border: none;
      white-space: nowrap;

      &.ant-radio-button-wrapper-checked {
        background: '#0091ff';
        // color: '#fff';
      }

      &:not(.ant-radio-button-wrapper-checked) {
        background: none;
      }

      &::before {
        width: 0;
      }
    }
  }

  .ant-btn {
    font-family: Roboto-Regular, sans-serif;
  }

  .ant-btn.warningBtn {
    color: ${props.red};
    border-color: ${props.red};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;

    svg {
      width: 20px;
      height: 20px;
    }

    &.ant-btn-link {
      border: none;
    }

    &:hover {
      color: ${props.red};
      border-color: ${props.red};
    }
  }

  .ant-btn.primaryBtn {
    color: ${props.blue};
    border-color: ${props.blue};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;

    svg {
      width: 20px;
      height: 20px;
    }

    &.ant-btn-link {
      border: none;
    }

    &:hover {
      color: ${props.blue};
      border-color: ${props.blue};
    }
  }

  .ant-btn.cancelBtn {
    color: ${props.darkGray};
    border-color: ${props.darkGray};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;

    svg {
      width: 20px;
      height: 20px;
    }

    &.ant-btn-link {
      border: none;
    }

    &:hover {
      color: ${props.darkGray};
      border-color: ${props.darkGray};
    }
  }

  .ant-btn.studioAddBtn {
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    padding: 0 29px;

    a {
      display: flex;
      align-items: center;
    }

    .studioAddBtnIcon {
      display: inline-flex;
      margin-right: 10px;
      height: 22px;

      > svg {
        width: 22px;
        height: 22px;
      }

      & ~ span {
        margin-left: 0;
      }
    }
  }

  .studioFormFooter {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    height: 98px;
    display: flex;
    align-items: center;
    justify-content: center;
    // background: #fff;
    box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);

    button {
      width: 236px;

      &:not(:last-child) {
        margin-right: 50px;
      }
    }
  }

  .ant-form-item-label label {
    font-family: Roboto-Bold, sans-serif;
  }
`;
