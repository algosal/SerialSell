import axios from "axios";

const API_URL =
  "https://silotosidewalks.com/app/REST/v1/product_variation_for_app_usage.php"; // Replace with your API endpoint

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    // alert(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
