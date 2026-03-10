import "./App.css"
import { Suspense, lazy } from "react"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import { useSelector } from "react-redux"
import { ACCOUNT_TYPE } from "./utils/constants"

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"))
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"))
const About = lazy(() => import("./pages/About"))
const Contact = lazy(() => import("./pages/Contact"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Catalog = lazy(() => import("./pages/Catalog"))
const CourseSearch = lazy(() => import("./pages/CourseSearch"))
const CourseDetails = lazy(() => import("./pages/CourseDetails"))
const ViewCourse = lazy(() => import("./pages/ViewCourse"))
const Error = lazy(() => import("./pages/Error"))
const MyProfile = lazy(() => import("./components/core/Dashboard/MyProfile"))
const Settings = lazy(() => import("./components/core/Dashboard/Settings"))
const EnrolledCourses = lazy(() =>
  import("./components/core/Dashboard/EnrolledCourses")
)
const Cart = lazy(() => import("./components/core/Dashboard/Cart"))
const AddCourse = lazy(() => import("./components/core/Dashboard/AddCourse"))
const MyCourses = lazy(() => import("./components/core/Dashboard/MyCourses"))
const EditCourse = lazy(() => import("./components/core/Dashboard/EditCourse"))
const VideoDetails = lazy(() => import("./components/core/ViewCourse/VideoDetails"))
const Instructor = lazy(() =>
  import("./components/core/Dashboard/InstructorDashboard/Instructor")
)

function App() {
  const { user } = useSelector((state) => state.profile)

  const routeLoader = (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="spinner"></div>
    </div>
  )

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Suspense fallback={routeLoader}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="search" element={<CourseSearch />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />

          <Route
            path="signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route
            path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />

          <Route
            path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />

          <Route
            path="update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/Settings" element={<Settings />} />

            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrolledCourses />}
                />
              </>
            )}

            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route
                  path="dashboard/edit-course/:courseId"
                  element={<EditCourse />}
                />
              </>
            )}
          </Route>

          <Route
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            )}
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
