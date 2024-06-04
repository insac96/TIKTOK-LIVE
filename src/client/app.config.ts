export default defineAppConfig({
  ui: {
    primary: 'green',
    
    gray: 'neutral',

    icons: {
      dynamic: true
    },

    avatar: {
      rounded: 'rounded-full'
    },

    button: {
      default: {
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-xl',
      color: {
        gray: {
          solid: 'ring-0'
        }
      }
    },

    buttonGroup: {
      rounded: 'rounded-xl',
    },

    barge: {
      rounded: 'rounded-xl',
    },

    card: {
      base: 'relative overflow-y-auto',
      rounded: 'rounded-xl',
      body: {
        padding: 'px-2 py-2 sm:p-4'
      },
      header: {
        padding: 'px-2 py-2 sm:px-4'
      },
      footer: {
        padding: 'px-2 py-2 pt-0 sm:px-4'
      }
    },

    input: {
      default: {
        color: 'gray',
        size: 'lg',
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-xl',
      color: {
        gray: {
          outline: 'ring-0'
        }
      }
    },

    alert:{
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      }
    },

    badge: {
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      }
    },

    modal: {
      container: 'items-center',
      overlay: {
        background: 'bg-white/25 dark:bg-black/50 backdrop-blur'
      },
      base: 'overflow-x-hidden overflow-visible'
    },

    slideover: {
      overlay: {
        background: 'bg-white/25 dark:bg-black/50 backdrop-blur'
      }
    },

    notifications: {
      position: 'right-0 top-0 bottom-auto',
    },
    
    notification: {
      background: 'dark:bg-black/50 backdrop-blur',
      progress: {
        base: 'h-0.5'
      }
    },

    formGroup: {
      wrapper: 'mb-4',
      container: 'mt-2'
    },

    table: {
      th: {
        base: 'whitespace-nowrap'
      }
    },

    pagination: {
      wrapper: 'flex items-center gap-1',
      rounded: '!rounded-full min-w-[32px] justify-center'
    },

    select: {
      rounded: 'rounded-xl',
      default: {
        loadingIcon: 'i-bx-loader-alt'
      }
    }
  }
})