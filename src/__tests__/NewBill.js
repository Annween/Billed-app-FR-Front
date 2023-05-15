/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import {fireEvent, screen} from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";
import userEvent from '@testing-library/user-event'

beforeAll(() => {
	Object.defineProperty(window, "localStorage", {
		value: localStorageMock,
	});

	window.localStorage.setItem(
		"user",
		JSON.stringify({
			type: "Employee",
			email: "a@a",
		})
	);
});
beforeEach(() => {
	document.body.innerHTML = NewBillUI()
})

afterEach(() => {
	document.body.innerHTML = ''
})


//handleChangeFile test
//describe("Given I am connected as employee", () => {
//	describe("When I am on NewBill Page", () => {
//		describe("Then a new bill is submitted", () => {
//			test("Test handleChangeFile", () => {
//
//				Object.defineProperty(window, 'localStorage', {value: localStorageMock})
//				window.localStorage.setItem('user', JSON.stringify({
//					type: 'Employee'
//				}))
//
//				const onNavigate = (pathname) => {
//					document.body.innerHTML = ROUTES({pathname})
//				}
//
//				const firestore = null
//
//				const addBill = new NewBill({
//					document,
//					onNavigate,
//					firestore,
//					localStorage: window.localStorage
//				})
//
//				const handleChangeFile = jest.fn(e => addBill.handleChangeFile(e))
//
//				const str = JSON.stringify({hello: "world"});
//				const blob = new Blob([str]);
//				const file = new File([blob], "hello.png", {
//					type: "image/png",
//				})
//
//				const email = JSON.parse(localStorage.getItem("user")).email
//
//				//verify if file and email append to formData
//				const formData = new FormData()
//				formData.append("file", file)
//				formData.append("email", email)
//
//
//				const input = screen.getByTestId('file')
//				fireEvent.change(input, {target: {files: [file]}})
//
//
//				const form = screen.getByTestId('form-new-bill')
//				form.addEventListener('submit', handleChangeFile)
//				fireEvent.submit(form)
//
//
//				expect(handleChangeFile).toHaveBeenCalled()
//				//expect(handleChangeFile).toHaveBeenCalledTimes(1)
//			})
//		})
//	})
//})

describe("Given I am connected as employee", () => {
	describe("When I submit a new bill", () => {
		test('Then, I can select a png, jpg or jpeg file', () => {

			const html = NewBillUI()
			document.body.innerHTML = html
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname })
			}
			const newBillContainer = new NewBill({
				document,
				onNavigate,
				store: mockStore,
				localStorage: window.localStorage,
			})

			const changeFile = jest.fn(newBillContainer.handleChangeFile) // function test
			const file = screen.getByTestId('file')
			expect(file).toBeTruthy()

			const testFile = new File(['sample.jpg'], 'sample.jpg', {
				type: 'image/jpg',
			}) // create file to test

			file.addEventListener('change', changeFile) // event listener chnage for function
			userEvent.upload(file, testFile) // upload file test

			expect(changeFile).toHaveBeenCalled() // the function is expected to have been called
			expect(file.files[0]).toEqual(testFile) // the uploaded file is the test file
			expect(file.files[0].name).toBe('sample.jpg') // the file name corresponds to the test file

			jest.spyOn(window, 'alert').mockImplementation(() => {}) // mock call alert
			expect(window.alert).not.toHaveBeenCalled() // expects the alert was not called
		})

// 		test("handleChange file function should be called", () => {
// 			const onNavigate = (pathname) => {
// 				document.body.innerHTML = ROUTES({pathname})
// 			}
//
// 			const newBill = new NewBill({
// 				document,
// 				onNavigate,
// 				store: mockStore,
// 				localStorage: window.localStorage
// 			})
//
//
// 			//const str = JSON.stringify({hello: "world"});
// 			//const blob = new Blob([str]);
//
// 			const handleChangeFile = jest.spyOn(newBill, "handleChangeFile");
// 			const imageInput = screen.getByTestId("file");
// 			const checkFileExtension = jest.spyOn(newBill, "checkFileExtension");
// 			imageInput.addEventListener("change", handleChangeFile);
//
// 			fireEvent.change(imageInput, {
// 				target: {
// 					files: [
// 						new File(["image"], "image.jpg", {
// 							type: "image/jpg",
// 						})
// 					],
// 				},
// 			})
//
// 			expect(handleChangeFile).toHaveBeenCalledTimes(1);
// 			expect(checkFileExtension.mock.results[0].value).toBeTruthy();
//
// 			//const file = new File([blob], "hello.jpeg", {
// 			//	type: "image/jpeg",
// 			//});
//
// 			//const input = screen.getByTestId('file')
// ////
// 			//fireEvent.change(input, {target: {value: 'hello.jpeg', files: ['hello.jpeg']}})
// 			//const form = screen.getByTestId('form-new-bill')
// 			//form.addEventListener('submit', newBill.handleChangeFile)
//
// 			//expect(1).toBe(1)
//
// 		})
	})
})


describe("Given I am connected as employee", () => {
	describe("When I am on NewBill Page, when I submit a new Bill", () => {
		test("The checkFile function should return true if the file match to the allowed extensions", () => {
			const str = JSON.stringify({hello: "world"});
			const blob = new Blob([str]);
			const file = new File([blob], "hello.jpeg", {
				type: "image/jpeg",
			});

			const extension = file.name.split('.').pop();
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({pathname})
			}

			const addBill = new NewBill(
				{
					document,
					onNavigate,
					firestore: null,
					localStorage: window.localStorage
				}
			);
			const checkFileExtension = addBill.checkFileExtension(extension);
			expect(checkFileExtension).toBe(true);

		})
		test("The checkFile function should return false", () => {
			const str = JSON.stringify({hello: "world"});
			const blob = new Blob([str]);
			const file = new File([blob], "hello.pdf", {
				type: "application/pdf",
			});
			//get extension of file
			const extension = file.name.split('.').pop();
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({pathname})
			}

			const addBill = new NewBill(
				{
					document,
					onNavigate,
					firestore: null,
					localStorage: window.localStorage

				});
			const checkFileExtension = addBill.checkFileExtension(extension);
			expect(checkFileExtension).toBe(false);

		})
	})
})

//describe("Given I am connected as employee", () => {
//	describe("When I update a bill", () => {
//		test("Then the bill should be updated", () => {
//
//			const onNavigate = (pathname) => {
//				document.body.innerHTML = ROUTES({pathname})
//			}
//
//			const firestore = null
//
//			const addBill = new NewBill({
//				document,
//				onNavigate,
//				firestore,
//				localStorage: window.localStorage
//			})
//
//			const updateBill = jest.fn(e => addBill.updateBill(e))
//			const form = screen.getByTestId('form-new-bill')
//			form.addEventListener('submit', updateBill)
//			fireEvent.submit(form)
//
//			expect(updateBill).toHaveBeenCalled()
//			expect(updateBill).toHaveBeenCalledTimes(1)
//
//		})
//
//	})
//})


//POST integration test

describe("Given I am a user connected as Employee", () => {
	describe("When I create a new bill", () => {
		test("Then a new bill should be created", async () => {
			document.body.innerHTML = NewBillUI()

			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({pathname})
			}


			Object.defineProperty(window, 'localStorage', {value: localStorageMock})

			const newBill = new NewBill({
				document,
				onNavigate,
				store: mockStore,
				localStorage: window.localStorage
			})

			const billExample = {
				"id": "47qAXb6fIm2zOKkLzMro",
				"vat": "80",
				"fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
				"status": "pending",
				"type": "Hôtel et logement",
				"commentary": "séminaire billed",
				"name": "encore",
				"fileName": "preview-facture-free-201801-pdf-1.jpg",
				"date": "2004-04-04",
				"amount": 400,
				"commentAdmin": "ok",
				"email": "a@a",
				"pct": 20

			}

			screen.getByTestId('expense-type').value = billExample.type
			screen.getByTestId('expense-name').value = billExample.name
			screen.getByTestId('datepicker').value = billExample.date
			screen.getByTestId('amount').value = billExample.amount
			screen.getByTestId('vat').value = billExample.vat
			screen.getByTestId('pct').value = billExample.pct
			screen.getByTestId('commentary').value = billExample.commentary



			newBill.fileName = billExample.fileName
			newBill.fileUrl = billExample.fileUrl

			const handleSubmit = jest.fn(newBill.handleSubmit)
			const form = screen.getByTestId('form-new-bill')
			form.addEventListener('submit', handleSubmit)
			fireEvent.submit(form)

			expect(handleSubmit).toHaveBeenCalled()

		})
	})
})


//describe("Given I am connected as an employee", () => {
//    describe("When I am on NewBill Page", () => {
//        test("Then ...", () => {
//            document.body.innerHTML = NewBillUI()
//            //to-do write assertion
//            expect(document.body.innerHTML).toBeTruthy()
//        })
//    })
//})





