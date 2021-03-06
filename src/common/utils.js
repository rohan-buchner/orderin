import { union, difference } from "lodash";

export const filterRestaurant = (filterInput) => {
  const { restaurant, locationSearched } = filterInput;

  const hasMatchingCategoryOrItems =
    restaurant.Categories.length > 0 || restaurant.MenuItems.length > 0;

  const hasMatchingLocation = restaurant.City.toLowerCase().includes(
    locationSearched.toLowerCase()
  );

  return locationSearched
    ? hasMatchingCategoryOrItems && hasMatchingLocation
    : hasMatchingCategoryOrItems;
};

export const getFitleredRestaurants = (searchKeyword, restaurants) => {
  const splited = searchKeyword.split(" in ");

  const productSearched = splited[0];
  const locationSearched =
    splited.length > 1 ? splited[splited.length - 1] : "";

  const filteredRestaurants = restaurants
    .map((restaurant) => {
      //categories that contain keyword in name
      const filteredCategories = restaurant.Categories.filter((category) =>
        category.Name.toLowerCase().includes(productSearched.toLowerCase())
      );

      //other categories that dot not contain keyword in name
      const otherCategories = difference(
        restaurant.Categories,
        filteredCategories
      );

      //menu items from other categories that contain keyword in their names
      const filteredMenuItems =
        otherCategories.length > 0
          ? otherCategories
              .map(({ MenuItems }) => MenuItems)
              .reduce((prevValue, currentValue) =>
                union(prevValue, currentValue)
              )
              .filter((menuItem) =>
                menuItem.Name.toLowerCase().includes(
                  productSearched.toLowerCase()
                )
              )
          : [];

      return {
        ...restaurant,
        Categories: filteredCategories,
        MenuItems: filteredMenuItems,
      };
    })
    .filter((restaurant) => filterRestaurant({ restaurant, locationSearched }));

  return {
    productSearched,
    locationSearched,
    filteredRestaurants,
  };
};
