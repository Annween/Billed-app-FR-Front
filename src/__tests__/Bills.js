/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import {bills} from "../fixtures/bills.js"
import {ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";


import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store.js";



describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {

            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            //to-do write expect expression
            expect(windowIcon.classList.contains('active-icon')).toBeTruthy()

        })
        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({data: bills})
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = (a, b) => ((a < b) ? 1 : -1)
            const datesSorted = [...dates].sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        })
    })
})

describe("Given I am connected as an employee", () => {
    describe('When I am on Bills Page', () => {
        describe('And I click on the New Bill button', () => {
            test('Then I should be on New Bill Page', () => {
                Object.defineProperty(window, 'localStorage', {value: localStorageMock})
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee'
                }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.append(root)
                router()
                window.onNavigate(ROUTES_PATH.Bills)


                const bill = new Bills({
                    document,
                    onNavigate,
                    store: null,
                    localStorage: window.localStorage
                })

                const handleClickNewBill = jest.fn(() => bill.handleClickNewBill())
                const btnNewBill = screen.getByTestId('btn-new-bill')
                btnNewBill.addEventListener('click', handleClickNewBill)
                userEvent.click(btnNewBill)
                expect(handleClickNewBill).toHaveBeenCalled()

            })
        })
    })
})


describe("Given I am connected as an employee", () => {
    describe('When I am on Bills Page', () => {
        describe('And I click on the eye button', () => {
            test('Then handleClickOnEye function should be called', () => {
                window.localStorage.setItem('user', JSON.stringify({
                    type: 'Employee'
                }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.append(root)
                router()
                window.onNavigate(ROUTES_PATH.Bills)


                const bill = new Bills({
                    document, onNavigate, store: null, localStorage: window.localStorage
                })

                const iconEye = screen.getAllByTestId('icon-eye')[3]
                console.log(iconEye)
                const handleClickIconEye = jest.fn(() => bill.handleClickIconEye(iconEye))
                //get the first eye icon

                iconEye.addEventListener('click', handleClickIconEye)
                userEvent.click(iconEye)
                expect(handleClickIconEye).toHaveBeenCalled()

            })
        })
    })
})

//test d'intégration GET

describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to Bills Page", () => {
        test("I should get all the bills", (object, method) =>
        {
            const getSpy = jest.spyOn(mockStore, "get")

            const bills = new Bills({
                document, onNavigate, firestore: null, localStorage: window.localStorage
            })
            bills.getBills()
            expect(getSpy).toHaveBeenCalled()
        })

    })

})

//describe("Given I am a user connected as Employee", () => {
//    describe("When I navigate to Bills Page", () => {
//        test("testme fetches bills from mock API GET", async () => {
//            localStorage.setItem("user", JSON.stringify({type: "Employee", email: "a@a"}));
//            const root = document.createElement("div")
//
//            root.setAttribute("id", "root")
//            document.body.append(root)
//            router()
//            window.onNavigate(ROUTES_PATH.Bills)
//            //await waitFor(() => screen.getByText("Mes notes de frais"))
//            const html = BillsUI({data: bills})
//            document.body.innerHTML = html
//            expect(screen.getByText("Mes notes de frais")).toBeTruthy()
//            expect(html).toBeTruthy()
//        })
//
//    })
//
//
//    describe("When an error occurs on API", () => {
//        beforeEach((object, method) => {
//          jest.spyOn(mockStore, "bills")
//          Object.defineProperty(
//              window,
//              'localStorage',
//              { value: localStorageMock }
//          )
//          window.localStorage.setItem('user', JSON.stringify({
//            type: 'Employee',
//            email: "a@a"
//          }))
//          const root = document.createElement("div")
//          root.setAttribute("id", "root")
//          document.body.appendChild(root)
//          router()
//        })
//        test("fetches bills from an API and fails with 404 message error", async () => {
//
//          mockStore.bills.mockImplementationOnce(() => {
//            return {
//              list : () =>  {
//                return Promise.reject(new Error("Erreur 404"))
//              }
//            }})
//          window.onNavigate(ROUTES_PATH.Bills)
//          await new Promise(process.nextTick);
//          const message = await screen.getByText(/Erreur 404/)
//          expect(message).toBeTruthy()
//        })
//
//        test("fetches messages from an API and fails with 500 message error", async () => {
//
//          mockStore.bills.mockImplementationOnce(() => {
//            return {
//              list : () =>  {
//                return Promise.reject(new Error("Erreur 500"))
//              }
//            }})
//
//          window.onNavigate(ROUTES_PATH.Bills)
//          await new Promise(process.nextTick);
//          const message = await screen.getByText(/Erreur 500/)
//          expect(message).toBeTruthy()
//        })
//      })
//
//})



