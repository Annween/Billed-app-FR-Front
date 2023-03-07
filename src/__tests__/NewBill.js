/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import {fireEvent, screen} from "@testing-library/dom";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store.js";


beforeEach(() => {
    document.body.innerHTML = NewBillUI()
})

afterEach(() => {
    document.body.innerHTML = ''
})


//handleChangeFile test
describe("Given I am connected as employee", () => {
    describe("When I am on NewBill Page", () => {
        describe("Then a new bill is submitted", () => {
            test("Test handleChangeFile", () => {

                Object.defineProperty(window, 'localStorage', {value: localStorageMock})
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee'
                }))

                const onNavigate = (pathname) => {
                    document.body.innerHTML = ROUTES({pathname})
                }

                const firestore = null

                const addBill = new NewBill({
                    document,
                    onNavigate,
                    firestore,
                    localStorage: window.localStorage
                })

                const handleChangeFile = jest.fn(e => addBill.handleChangeFile(e))

                const file = new File(["hello"], "hello.png", {
                    type: "image/png",
                })

                const email = JSON.parse(localStorage.getItem("user")).email

                //verify if file and email append to formData
                const formData = new FormData()
                formData.append("file", file)
                formData.append("email", email)


                const input = screen.getByTestId('file')
                fireEvent.change(input, {target: {files: [file]}})


                const form = screen.getByTestId('form-new-bill')
                form.addEventListener('submit', handleChangeFile)
                fireEvent.submit(form)


                expect(handleChangeFile).toHaveBeenCalled()
                //expect(handleChangeFile).toHaveBeenCalledTimes(1)
            })
        })
    })
})

describe("Given I am connected as employee", () => {
    describe("When I am on NewBill Page", () => {
        test("The checkFile function should return true", () => {
            const file = new File(["hello"], "hello.jpeg", {
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
            const file = new File(["hello"], "hello.pdf", {
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
                }
            );
            const checkFileExtension = addBill.checkFileExtension(extension);
            expect(checkFileExtension).toBe(false);

        })
    })
})

describe("Given I am connected as employee", () => {
    describe("When I update a bill", () => {
        test("Then the bill should be updated", () => {

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname})
            }

            const firestore = null

            const addBill = new NewBill({
                document,
                onNavigate,
                firestore,
                localStorage: window.localStorage
            })

            const handleSubmit = jest.fn(e => addBill.handleSubmit(e))
            const form = screen.getByTestId('form-new-bill')
            form.addEventListener('submit', handleSubmit)
            fireEvent.submit(form)

            expect(handleSubmit).toHaveBeenCalled()
            expect(handleSubmit).toHaveBeenCalledTimes(1)

        })

    })
})


//POST integration test

describe("Given I am a user connected as Employee", () => {
    describe("When I create a new bill", () => {
        test("Then a new bill should be created", async () => {
            const postSpy = jest.spyOn(mockStore, "post")
            const bills = await mockStore.post()
            expect(postSpy).toHaveBeenCalledTimes(1)
            expect(bills.data.length).toBe(4)
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





