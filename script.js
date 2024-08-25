'use strict';

const API_URL = 'https://openexchangerates.org/api/latest.json?app_id=0ded2e02288e415ba5843b1bfb604777';

const currencyChoiceInputs = document.querySelectorAll('.currency__choice-input');
const currencyOutputs = document.querySelectorAll('.converter__currency-output');
const userInput = document.querySelector('.currency__datainput-input');
let currentCurrency;
let currentRubles;
console.log(currentRubles);


const getData = () => {
	return fetch(API_URL)
		.then(res => {
			if (res.status === 200) {
				return res.json();
			} else {
				throw new Error("Произошла ошибка, данные не были найдены!");
			}
		})
		.catch(error => {
			error => console.warn(error)
		});
}

const convertRubToOtherCurrency = (data, input, currency) => {
	const rublesToUsdRate = data.rates.RUB;

	let result;
	if (currency === 'USD') {
		result = input / rublesToUsdRate;
	} else {
		const currencyRate = data.rates[currency];
		result = input / rublesToUsdRate * currencyRate;
	}
	result = result.toFixed(2);

	return result;
}

const renderResult = (result, output1, output2) => {
	if (output2.innerText !== '') output2.innerText = '';
	output1.textContent = '';
	output1.textContent = splitNumbers(result);
}

const splitNumbers = (str) => {
	const regExp = /\B(?=(\d{3})+(?!\d))/g;
	return str.replace(regExp, ' ');
}

const digitsOnly = (str) => {
	const regExp = /\D+/g;
	return str.replace(regExp, '');
}

currencyChoiceInputs.forEach(radioBtn =>
	radioBtn.addEventListener('change', () => {
		if (currentRubles === undefined) return;

		currentCurrency = radioBtn.id.toUpperCase();

		if (radioBtn.id === 'usd') {
			getData()
				.then(data =>
					convertRubToOtherCurrency(data, currentRubles, currentCurrency))
				.then(result =>
					renderResult(result, currencyOutputs[0], currencyOutputs[1]));
		} else {
			getData()
				.then(data =>
					convertRubToOtherCurrency(data, currentRubles, currentCurrency))
				.then(result =>
					renderResult(result, currencyOutputs[1], currencyOutputs[0]));
		}
	})
);

userInput.addEventListener('input', () => {
	userInput.value = digitsOnly(userInput.value);
	userInput.value = splitNumbers(userInput.value);
	currentRubles = Number(userInput.value.replace(/\s+/g, ''));
	if (currentCurrency === 'USD') {
		getData()
			.then(data =>
				convertRubToOtherCurrency(data, currentRubles, currentCurrency))
			.then(result =>
				renderResult(result, currencyOutputs[0], currencyOutputs[1]));
	} else if (currentCurrency === 'EUR') {
		getData()
			.then(data =>
				convertRubToOtherCurrency(data, currentRubles, currentCurrency))
			.then(result =>
				renderResult(result, currencyOutputs[1], currencyOutputs[0]));
	}
})