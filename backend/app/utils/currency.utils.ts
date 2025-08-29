// utils/currency.ts
export const convertUSDtoINR = async (usdAmount: number): Promise<number> => {
  try {
    console.log("🔁 Converting USD to INR...");
    console.log("💵 USD Amount Received:", usdAmount);

    const response = await fetch("https://v6.exchangerate-api.com/v6/442aaf4783cb5579c4da4957/latest/USD");



    const data = await response.json();


    const rate = data.conversion_rates?.INR ?? 87;
    console.log("🔢 Conversion Rate (USD to INR):", rate);


    const inrAmount = usdAmount * rate;
    const finalAmount = parseFloat(inrAmount.toFixed(2)); // 👈 returns 2 decimals

    console.log("✅ Converted INR Amount:", finalAmount);
    return finalAmount;
  } catch (error) {
    console.error("❌ Currency conversion failed:", error);
    const fallbackAmount = Math.round(usdAmount * 87);
    console.log("🧯 Fallback Conversion Used (Rate: 87), INR Amount:", fallbackAmount);
    return fallbackAmount;
  }
};

// utils/currency.js

// const convertUSDtoINR = async (usdAmount) => {
//   try {
//     console.log("🔁 Converting USD to INR...");
//     console.log("💵 USD Amount Received:", usdAmount);

//     const response = await fetch(
//       "https://v6.exchangerate-api.com/v6/442aaf4783cb5579c4da4957/latest/USD"
//     );

//     const data = await response.json();

//     const rate = data.conversion_rates?.INR ?? 87;
//     console.log("🔢 Conversion Rate (USD to INR):", rate);

//     const inrAmount = usdAmount * rate;
//     const finalAmount = parseFloat(inrAmount.toFixed(2)); // 2 decimal places

//     console.log("✅ Converted INR Amount:", finalAmount);
//     return finalAmount;
//   } catch (error) {
//     console.error("❌ Currency conversion failed:", error);
//     const fallbackAmount = Math.round(usdAmount * 87);
//     console.log(
//       "🧯 Fallback Conversion Used (Rate: 87), INR Amount:",
//       fallbackAmount
//     );
//     return fallbackAmount;
//   }
// };

// module.exports = { convertUSDtoINR };
