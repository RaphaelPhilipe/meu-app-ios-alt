# Backend Required For This App

This mobile repository is ready for Codemagic and TestFlight, but the app depends on the SIGEV backend exposing the mobile endpoints already added in the PHP project.

Required backend routes:

- `api/mobile/auth/login`
- `api/mobile/auth/logout`
- `api/mobile/auth/session`
- `api/mobile/auth/web-session`
- `api/mobile/bootstrap`
- `api/mobile/dashboard`
- `api/mobile/visits`
- `api/mobile/visits/show`
- `api/mobile/notifications`
- `api/mobile/notifications/read`
- `api/mobile/notifications/read-all`
- `api/mobile/agenda`
- `api/mobile/agenda/schedule`
- `api/mobile/customers`
- `api/mobile/issues`
- `api/mobile/issues/show`
- `api/mobile/freight-adjustments`
- `api/mobile/freight-adjustments/show`
- `api/mobile/profile`
- `api/mobile/settings`
- `api/mobile/help`
- `api/mobile/about`

The corresponding backend changes were made in the local SIGEV PHP project under:

- `routes/api.php`
- `app/Controllers/Api/MobileController.php`
- `app/Services/MobileAppService.php`
- `app/config/mobile_navigation.php`

If these backend changes are not deployed to the server used by `src/config/environment.ts`, the app will build successfully but some screens will not load data.
