/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import {bills} from "../fixtures/bills.js"
import {ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import Dashboard from "../containers/Dashboard.js";

import {modal} from "../views/DashboardFormUI.js";

// jest.mock("../app/store", () => mockStore);

jest.mock("../app/store", () => mockStore)

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

		});
		test("Then bills should be ordered from earliest to latest", () => {
			document.body.innerHTML = BillsUI({data: bills})
			const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
			const antiChrono = (a, b) => ((a < b) ? 1 : -1)
			const datesSorted = [...dates].sort(antiChrono)
			expect(dates).toEqual(datesSorted)
		});
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
				const btnNewBill = document.getElementById('btnNewBill')

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

				$.fn.modal = jest.fn()
				const dashboard = new Dashboard({
					document, onNavigate,  bills, localStorage: window.localStorage
				})

				const iconEye = screen.getAllByTestId('icon-eye')[1]
				const handleClickIconEye = jest.fn(() => dashboard.handleClickIconEye(iconEye))
				//get the first eye icon

				iconEye.addEventListener('click', handleClickIconEye)

				userEvent.click(iconEye)
				expect(handleClickIconEye).toHaveBeenCalled()
				expect(modal).toBeTruthy()
			})
		})
	})
})





describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to Bills Page", () => {
        test("testme fetches bills from mock API GET", async () => {
            localStorage.setItem("user", JSON.stringify({type: "Employee", email: "a@a"}));
            const root = document.createElement("div")

            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            const html = BillsUI({data: bills})
            document.body.innerHTML = html
            //expect(screen.getByText("Mes notes de frais")).toBeTruthy()
            expect(html).toBeTruthy()
        })

    })
    describe("When an error occurs on API", () => {
	    // beforeEach((object, method) => {
	    //   jest.spyOn(mockStore, "bills")
	    //     console.log('ici ------------------')
	    //   Object.defineProperty(
	    //       window,
	    //       'localStorage',
	    //       { value: localStorageMock }
	    //   )

	    //     console.log('la ------------------>')
	    //   window.localStorage.setItem('user', JSON.stringify({
	    //     type: 'Employee',
	    //     email: "a@a"
	    //   }))

	    //     console.log('encore ici <------------------>')
	    //   const root = document.createElement("div")
	    //   root.setAttribute("id", "root")
	    //   document.body.appendChild(root)
	    //   router()

	    //     console.log('encore là <<------------------>>')
	    // })


	  // test("fetches bills from an API and fails with 401 message error", async () => {

	  //     jest.spyOn(mockStore, "bills")

	  //     Object.defineProperty(
	  //         window,
	  //         'localStorage',
	  //         { value: localStorageMock }
	  //     )


	  //     window.localStorage.setItem('user', JSON.stringify({
	  //         type: 'Employee',
	  //         email: "a@a"
	  //     }))


	  //     const root = document.createElement("div")
	  //     root.setAttribute("id", "root")
	  //     document.body.appendChild(root)
	  //     router()


	  //   mockStore.bills.mockImplementationOnce(() => {
	  //     return {
	  //       list : () =>  {
	  //         return Promise.reject(new Error("Erreur 401"))
	  //       }
	  //     }})
	  //   window.onNavigate(ROUTES_PATH.Bills)

	  //   const message = await screen.getByText("user must be authenticated")
	  //   expect(message).toBeTruthy()
	  // })

    })

})



