### EmployerExpAPI 
EmployerExpAPI for Employer Express App

### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

### Employees

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET   | `/employees`             | `employees#index`    |
| GET   | `/employees/employee_id>`    | `employees#show`    |
| POST   | `/employees/add`             | `employees#create`    |
| PATCH  | `/employees/<employees_id>` | `employees#update`  |
| DELETE | `/employees/<employees_id>`        | `employees#delete`   |

### Wages

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/employees/<employees_id>`             | `wages#create`    |
| PATCH  | `/employees/<employees_id>/<wages_id>` | `wages#update`  |
| DELETE | `/employees/<employees_id>/<wages_id>`        | `wages#delete`   |


### Feedback

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/employees/<employees_id>`             | `feedback#create`    |
| PATCH  | `/employees/<employees_id>/<feedback_id>` | `feedback#update`  |
| DELETE | `/employees/<employees_id>/<feedback_id>`        | `feedback#delete`   |

