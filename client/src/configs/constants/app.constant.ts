export const STYLE = {
  DESKTOP: {
    PADDING: '0px 100px',
    HEADER: {
      HEIGHT: '140px',
      PADDING: '5px 100px',
      SPACING_BOTTOM: '10px',
      NAVBARS: {
        ITEM_PADDING: '0px 10px',
      },
      SHORTCUTS: {
        SEARCH_WIDTH: '90%',
        SEARCH_HEIGH: '40px',
        SEARCH_PADDING: '15px',
        SEARCH_BORDER_RADIUS: '20px',
        SEARCH_BUTTON_SIZE: '30px',
      },
    },
    LOGO: {
      WIDTH: '80px',
      HEIGHT: '80px',
    },
    ACCOUNT_POPOVER: {
      WIDTH: '180px',
      AVATAR_SIZE: '65px',
    },
    CUSTOMER: {
      WIDTH: '575px',
      NAVBARS: {
        AVATAR_SIZE: '65px',
      },
      PROFILE: {
        AVATAR_SIZE: '100px',
        TITLE_SPACE: '70px',
      },
      ADDRESSES: {
        TITLE_SPACE: '300px',
      },
      ORDERS: {
        ITEM_IMAGE_SIZE: '80px',
        EMPTY_ORDER_IMAGE_SIZE: '200px',
      },
    },
    AUTH_FORM: {
      FORM_WIDTH: '500px',
      IMAGE_WIDTH: '190px',
      IMAGE_HEIGHT: '160px',
      IMAGE_SHIFT: '110px',
      CLOSE_BUTTON_SIZE: '30px',
    },
    BANNERS: {
      SLIDE_INFINITE: true,
      SLIDE_AUTOPLAY: true,
      SLIDE_DOTS: true,
      SLIDE_TO_SHOW: 1,
      SLIDE_TO_SCROLL: 1,
      SLIDE_AUTOPLAY_SPEED: 5000,
      MAIN_WIDTH: '70%',
      MAIN_HEIGHT: '280px',
      SUB_HEIGHT: '50%',
      SPACING: 1,
    },
    CATEGORIES: {
      PADDING: '10px',
      BORDER_RADIUS: '10px',
      ITEM_PADDING: '10px',
      ITEM_MARGIN: '2px',
      ICON_SIZE: '45px',
      ICON_BORDER_RADIUS: '50%',
    },
    CART: {
      GRID_TEMPLATE_COLUMNS: '44% 20% 15.5% 15.5% 5%',
      LIST_WIDTH: '850px',
      ITEM_IMAGE_SIZE: '80px',
      EMPTY_IMAGE_WIDTH: '190px',
      EMPTY_IMAGE_HEIGHT: '160px',
    },
    PRODUCT_SECTION: {
      SLIDE_INFINITE: false,
      SLIDE_AUTOPLAY: false,
      SLIDE_DOTS: false,
      SLIDE_TO_SHOW: 5,
      SLIDE_TO_SCROLL: 5,
    },
    PRODUCT: {
      CARD_WIDTH: '220px',
      CARD_HEIGHT: '225px',
      CARD_BORDER_RADIUS: '5px',
      CARD_MARGIN: '1px',
      CARD_PADDING: '10px',
      CONTENT_HEIGHT: '100px',
      IMAGE_WIDTH: '410px',
      IMAGE_HEIGHT: '350px',
      INTENDED_WIDTH: '300px',
      WARRANTY_ICON_SIZE: '32px',
      DESCRIPTION_MAX_HEIGHT: '400px',
      RATING_WIDTH: '335px',
    },
    CATEGORY: {
      FILTER_WIDTH: '250px',
    },
    FOOTER: {
      MARGIN_TOP: '50px',
      PADDING: '0 20px',
      BLOCK_WIDTH: '220px',
      BLOCK_SPACING: 4,
      ROW_SPACING: 2,
      GRID_REPEAT: 4,
      GRID_GAP: '5px',
      ICON_SIZE: '32px',
      ICON_BORDER_RADIUS: '50%',
      REC_WIDTH: '120px',
      REC_HEIGHT: '35px',
    },
    TELEPORT: {
      FROM_RIGHT: '20px',
      FROM_BOTTOM: '90px',
    },
    CAROUSEL: {
      DEFAULT_ARROW_WIDTH: '50px',
      DEFAULT_ARROW_HEIGHT: '50%',
      DEFAULT_DOT_SIZE: '8px',
    },
  },
  TABLET: {},
  MOBILE: {
    HEADER: {
      PADDING: '5px',
    },
    LOGO: {
      WIDTH: '50px',
      HEIGHT: '50px',
    },
    ACCOUNT_POPOVER: {
      WIDTH: '250px',
      AVATAR_SIZE: '80px',
    },
    CUSTOMER: {
      WIDTH: '100%',
      ORDERS: {
        ITEM_IMAGE_SIZE: '70px',
      },
    },
    AUTH_FORM: {
      FORM_WIDTH: '300px',
    },
    BANNERS: {
      MAIN_WIDTH: '100%',
      MAIN_HEIGHT: '200px',
      SUB_WIDTH: '50%',
      SUB_HEIGHT: '100px',
    },
    CART: {
      GRID_TEMPLATE_COLUMNS: '88% 12%',
      LIST_WIDTH: '400px',
    },
    PRODUCT_SECTION: {
      SLIDE_TO_SHOW: 2,
      SLIDE_TO_SCROLL: 2,
    },
    PRODUCT: {
      CARD_WIDTH: '175px',
      CARD_HEIGHT: '210px',
    },
    CATEGORY: {
      FILTER_WIDTH: '100%',
    },
    FOOTER: {
      BLOCK_SPACING: 0,
      ROW_SPACING: 1,
    },
    TELEPORT: {
      FROM_RIGHT: '5px',
      FROM_BOTTOM: '70px',
    },
  },
};

export const LIMIT_WIDGET_NUMBER = STYLE.DESKTOP.PRODUCT_SECTION.SLIDE_TO_SHOW * 4; // 4 is number of page
export const LIMIT_VIEW_MORE_WIDGET_NUMBER = 40;
export const LIMIT_FLASH_SALE_NUMBER = LIMIT_WIDGET_NUMBER;
export const LIMIT_SUGGESTION_NUMBER = 30;
export const LIMIT_RECOMMEND_NUMBER = 40;
export const LIMIT_ORDER_EACH_PAGE_NUMBER = 10;
export const SHOW_STOCK_QUANTITY_WHEN_REACH_NUMBER = 5;
export const SHOW_COLLAPSED_ATTRIBUTES_WHEN_REACH_NUMBER = 5;
