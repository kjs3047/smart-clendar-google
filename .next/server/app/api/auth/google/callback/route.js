/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/google/callback/route";
exports.ids = ["app/api/auth/google/callback/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/google/callback/route.ts":
/*!***********************************************!*\
  !*** ./app/api/auth/google/callback/route.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_defaultCategories__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/defaultCategories */ \"(rsc)/./lib/defaultCategories.ts\");\n\n\n\n\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const code = searchParams.get('code');\n    // Get session data to determine redirect URL\n    const sessionData = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.getSessionFromRequest)(request) || {};\n    const redirectUrl = sessionData.frontendOrigin || process.env.FRONTEND_URL || 'http://localhost:3000';\n    if (!code) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(`${redirectUrl}?error=auth_failed&message=Missing_authorization_code`);\n    }\n    try {\n        const { tokens } = await _lib_auth__WEBPACK_IMPORTED_MODULE_1__.oauth2Client.getToken(code);\n        _lib_auth__WEBPACK_IMPORTED_MODULE_1__.oauth2Client.setCredentials(tokens);\n        const ticket = await _lib_auth__WEBPACK_IMPORTED_MODULE_1__.oauth2Client.verifyIdToken({\n            idToken: tokens.id_token,\n            audience: process.env.GOOGLE_CLIENT_ID\n        });\n        const payload = ticket.getPayload();\n        if (!payload || !payload.sub || !payload.email || !payload.name) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(`${redirectUrl}?error=auth_failed&message=Failed_to_get_user_profile`);\n        }\n        // 기존 사용자인지 확인\n        const existingUser = await _lib_db__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n            where: {\n                googleId: payload.sub\n            }\n        });\n        const isNewUser = !existingUser;\n        const user = await _lib_db__WEBPACK_IMPORTED_MODULE_2__.prisma.user.upsert({\n            where: {\n                googleId: payload.sub\n            },\n            update: {\n                email: payload.email,\n                name: payload.name,\n                avatarUrl: payload.picture\n            },\n            create: {\n                id: payload.sub,\n                googleId: payload.sub,\n                email: payload.email,\n                name: payload.name,\n                avatarUrl: payload.picture\n            }\n        });\n        // 새 사용자인 경우 기본 카테고리 생성\n        if (isNewUser) {\n            try {\n                const hasCategories = await (0,_lib_defaultCategories__WEBPACK_IMPORTED_MODULE_3__.hasExistingCategories)(user.id);\n                if (!hasCategories) {\n                    await (0,_lib_defaultCategories__WEBPACK_IMPORTED_MODULE_3__.createDefaultCategoriesForUser)(user.id);\n                    console.log(`Default categories created for new user: ${user.email}`);\n                }\n            } catch (error) {\n                console.error('Failed to create default categories for new user:', error);\n            // 기본 카테고리 생성 실패해도 로그인은 계속 진행\n            }\n        }\n        // Update session with user ID\n        sessionData.userId = user.id;\n        const response = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(redirectUrl);\n        response.cookies.set('session', (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.createSessionCookie)(sessionData), {\n            maxAge: 30 * 24 * 60 * 60,\n            httpOnly: true,\n            secure: \"development\" === 'production',\n            sameSite: 'lax'\n        });\n        return response;\n    } catch (error) {\n        console.error('Google Auth Callback Error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(`${redirectUrl}?error=auth_failed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvZ29vZ2xlL2NhbGxiYWNrL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXdEO0FBQzhCO0FBQ3BEO0FBQzhEO0FBRXpGLGVBQWVPLElBQUlDLE9BQW9CO0lBQzVDLE1BQU0sRUFBRUMsWUFBWSxFQUFFLEdBQUcsSUFBSUMsSUFBSUYsUUFBUUcsR0FBRztJQUM1QyxNQUFNQyxPQUFPSCxhQUFhSSxHQUFHLENBQUM7SUFFOUIsNkNBQTZDO0lBQzdDLE1BQU1DLGNBQWNYLGdFQUFxQkEsQ0FBQ0ssWUFBWSxDQUFDO0lBQ3ZELE1BQU1PLGNBQWNELFlBQVlFLGNBQWMsSUFBSUMsUUFBUUMsR0FBRyxDQUFDQyxZQUFZLElBQUk7SUFFOUUsSUFBSSxDQUFDUCxNQUFNO1FBQ1QsT0FBT1oscURBQVlBLENBQUNvQixRQUFRLENBQUMsR0FBR0wsWUFBWSxxREFBcUQsQ0FBQztJQUNwRztJQUVBLElBQUk7UUFDRixNQUFNLEVBQUVNLE1BQU0sRUFBRSxHQUFHLE1BQU1wQixtREFBWUEsQ0FBQ3FCLFFBQVEsQ0FBQ1Y7UUFDL0NYLG1EQUFZQSxDQUFDc0IsY0FBYyxDQUFDRjtRQUU1QixNQUFNRyxTQUFTLE1BQU12QixtREFBWUEsQ0FBQ3dCLGFBQWEsQ0FBQztZQUM5Q0MsU0FBU0wsT0FBT00sUUFBUTtZQUN4QkMsVUFBVVgsUUFBUUMsR0FBRyxDQUFDVyxnQkFBZ0I7UUFDeEM7UUFFQSxNQUFNQyxVQUFVTixPQUFPTyxVQUFVO1FBQ2pDLElBQUksQ0FBQ0QsV0FBVyxDQUFDQSxRQUFRRSxHQUFHLElBQUksQ0FBQ0YsUUFBUUcsS0FBSyxJQUFJLENBQUNILFFBQVFJLElBQUksRUFBRTtZQUMvRCxPQUFPbEMscURBQVlBLENBQUNvQixRQUFRLENBQUMsR0FBR0wsWUFBWSxxREFBcUQsQ0FBQztRQUNwRztRQUVBLGNBQWM7UUFDZCxNQUFNb0IsZUFBZSxNQUFNL0IsMkNBQU1BLENBQUNnQyxJQUFJLENBQUNDLFVBQVUsQ0FBQztZQUNoREMsT0FBTztnQkFBRUMsVUFBVVQsUUFBUUUsR0FBRztZQUFDO1FBQ2pDO1FBRUEsTUFBTVEsWUFBWSxDQUFDTDtRQUVuQixNQUFNQyxPQUFPLE1BQU1oQywyQ0FBTUEsQ0FBQ2dDLElBQUksQ0FBQ0ssTUFBTSxDQUFDO1lBQ3BDSCxPQUFPO2dCQUFFQyxVQUFVVCxRQUFRRSxHQUFHO1lBQUM7WUFDL0JVLFFBQVE7Z0JBQ05ULE9BQU9ILFFBQVFHLEtBQUs7Z0JBQ3BCQyxNQUFNSixRQUFRSSxJQUFJO2dCQUNsQlMsV0FBV2IsUUFBUWMsT0FBTztZQUM1QjtZQUNBQyxRQUFRO2dCQUNOQyxJQUFJaEIsUUFBUUUsR0FBRztnQkFDZk8sVUFBVVQsUUFBUUUsR0FBRztnQkFDckJDLE9BQU9ILFFBQVFHLEtBQUs7Z0JBQ3BCQyxNQUFNSixRQUFRSSxJQUFJO2dCQUNsQlMsV0FBV2IsUUFBUWMsT0FBTztZQUM1QjtRQUNGO1FBRUEsdUJBQXVCO1FBQ3ZCLElBQUlKLFdBQVc7WUFDYixJQUFJO2dCQUNGLE1BQU1PLGdCQUFnQixNQUFNekMsNkVBQXFCQSxDQUFDOEIsS0FBS1UsRUFBRTtnQkFDekQsSUFBSSxDQUFDQyxlQUFlO29CQUNsQixNQUFNMUMsc0ZBQThCQSxDQUFDK0IsS0FBS1UsRUFBRTtvQkFDNUNFLFFBQVFDLEdBQUcsQ0FBQyxDQUFDLHlDQUF5QyxFQUFFYixLQUFLSCxLQUFLLEVBQUU7Z0JBQ3RFO1lBQ0YsRUFBRSxPQUFPaUIsT0FBTztnQkFDZEYsUUFBUUUsS0FBSyxDQUFDLHFEQUFxREE7WUFDbkUsNkJBQTZCO1lBQy9CO1FBQ0Y7UUFFQSw4QkFBOEI7UUFDOUJwQyxZQUFZcUMsTUFBTSxHQUFHZixLQUFLVSxFQUFFO1FBRTVCLE1BQU1NLFdBQVdwRCxxREFBWUEsQ0FBQ29CLFFBQVEsQ0FBQ0w7UUFDdkNxQyxTQUFTQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxXQUFXcEQsOERBQW1CQSxDQUFDWSxjQUFjO1lBQ2hFeUMsUUFBUSxLQUFLLEtBQUssS0FBSztZQUN2QkMsVUFBVTtZQUNWQyxRQUFReEMsa0JBQXlCO1lBQ2pDeUMsVUFBVTtRQUNaO1FBRUEsT0FBT047SUFDVCxFQUFFLE9BQU9GLE9BQU87UUFDZEYsUUFBUUUsS0FBSyxDQUFDLCtCQUErQkE7UUFDN0MsT0FBT2xELHFEQUFZQSxDQUFDb0IsUUFBUSxDQUFDLEdBQUdMLFlBQVksa0JBQWtCLENBQUM7SUFDakU7QUFDRiIsInNvdXJjZXMiOlsiQzpcXGRldlxccHJqXFxzbWFydC1jYWxlbmRhclxcYXBwXFxhcGlcXGF1dGhcXGdvb2dsZVxcY2FsbGJhY2tcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcbmltcG9ydCB7IG9hdXRoMkNsaWVudCwgY3JlYXRlU2Vzc2lvbkNvb2tpZSwgZ2V0U2Vzc2lvbkZyb21SZXF1ZXN0IH0gZnJvbSAnQC9saWIvYXV0aCc7XHJcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL2RiJztcclxuaW1wb3J0IHsgY3JlYXRlRGVmYXVsdENhdGVnb3JpZXNGb3JVc2VyLCBoYXNFeGlzdGluZ0NhdGVnb3JpZXMgfSBmcm9tICdAL2xpYi9kZWZhdWx0Q2F0ZWdvcmllcyc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xyXG4gIGNvbnN0IGNvZGUgPSBzZWFyY2hQYXJhbXMuZ2V0KCdjb2RlJyk7XHJcbiAgXHJcbiAgLy8gR2V0IHNlc3Npb24gZGF0YSB0byBkZXRlcm1pbmUgcmVkaXJlY3QgVVJMXHJcbiAgY29uc3Qgc2Vzc2lvbkRhdGEgPSBnZXRTZXNzaW9uRnJvbVJlcXVlc3QocmVxdWVzdCkgfHwge307XHJcbiAgY29uc3QgcmVkaXJlY3RVcmwgPSBzZXNzaW9uRGF0YS5mcm9udGVuZE9yaWdpbiB8fCBwcm9jZXNzLmVudi5GUk9OVEVORF9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCc7XHJcblxyXG4gIGlmICghY29kZSkge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5yZWRpcmVjdChgJHtyZWRpcmVjdFVybH0/ZXJyb3I9YXV0aF9mYWlsZWQmbWVzc2FnZT1NaXNzaW5nX2F1dGhvcml6YXRpb25fY29kZWApO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgdG9rZW5zIH0gPSBhd2FpdCBvYXV0aDJDbGllbnQuZ2V0VG9rZW4oY29kZSk7XHJcbiAgICBvYXV0aDJDbGllbnQuc2V0Q3JlZGVudGlhbHModG9rZW5zKTtcclxuXHJcbiAgICBjb25zdCB0aWNrZXQgPSBhd2FpdCBvYXV0aDJDbGllbnQudmVyaWZ5SWRUb2tlbih7XHJcbiAgICAgIGlkVG9rZW46IHRva2Vucy5pZF90b2tlbiEsXHJcbiAgICAgIGF1ZGllbmNlOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lELFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcGF5bG9hZCA9IHRpY2tldC5nZXRQYXlsb2FkKCk7XHJcbiAgICBpZiAoIXBheWxvYWQgfHwgIXBheWxvYWQuc3ViIHx8ICFwYXlsb2FkLmVtYWlsIHx8ICFwYXlsb2FkLm5hbWUpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5yZWRpcmVjdChgJHtyZWRpcmVjdFVybH0/ZXJyb3I9YXV0aF9mYWlsZWQmbWVzc2FnZT1GYWlsZWRfdG9fZ2V0X3VzZXJfcHJvZmlsZWApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOq4sOyhtCDsgqzsmqnsnpDsnbjsp4Ag7ZmV7J24XHJcbiAgICBjb25zdCBleGlzdGluZ1VzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcclxuICAgICAgd2hlcmU6IHsgZ29vZ2xlSWQ6IHBheWxvYWQuc3ViIH1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBjb25zdCBpc05ld1VzZXIgPSAhZXhpc3RpbmdVc2VyO1xyXG5cclxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci51cHNlcnQoe1xyXG4gICAgICB3aGVyZTogeyBnb29nbGVJZDogcGF5bG9hZC5zdWIgfSxcclxuICAgICAgdXBkYXRlOiB7XHJcbiAgICAgICAgZW1haWw6IHBheWxvYWQuZW1haWwsXHJcbiAgICAgICAgbmFtZTogcGF5bG9hZC5uYW1lLFxyXG4gICAgICAgIGF2YXRhclVybDogcGF5bG9hZC5waWN0dXJlLFxyXG4gICAgICB9LFxyXG4gICAgICBjcmVhdGU6IHtcclxuICAgICAgICBpZDogcGF5bG9hZC5zdWIsXHJcbiAgICAgICAgZ29vZ2xlSWQ6IHBheWxvYWQuc3ViLFxyXG4gICAgICAgIGVtYWlsOiBwYXlsb2FkLmVtYWlsLFxyXG4gICAgICAgIG5hbWU6IHBheWxvYWQubmFtZSxcclxuICAgICAgICBhdmF0YXJVcmw6IHBheWxvYWQucGljdHVyZSxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOyDiCDsgqzsmqnsnpDsnbgg6rK97JqwIOq4sOuzuCDsubTthYzqs6Drpqwg7IOd7ISxXHJcbiAgICBpZiAoaXNOZXdVc2VyKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgaGFzQ2F0ZWdvcmllcyA9IGF3YWl0IGhhc0V4aXN0aW5nQ2F0ZWdvcmllcyh1c2VyLmlkKTtcclxuICAgICAgICBpZiAoIWhhc0NhdGVnb3JpZXMpIHtcclxuICAgICAgICAgIGF3YWl0IGNyZWF0ZURlZmF1bHRDYXRlZ29yaWVzRm9yVXNlcih1c2VyLmlkKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBEZWZhdWx0IGNhdGVnb3JpZXMgY3JlYXRlZCBmb3IgbmV3IHVzZXI6ICR7dXNlci5lbWFpbH1gKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBkZWZhdWx0IGNhdGVnb3JpZXMgZm9yIG5ldyB1c2VyOicsIGVycm9yKTtcclxuICAgICAgICAvLyDquLDrs7gg7Lm07YWM6rOg66asIOyDneyEsSDsi6TtjKjtlbTrj4Qg66Gc6re47J247J2AIOqzhOyGjSDsp4TtlolcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSBzZXNzaW9uIHdpdGggdXNlciBJRFxyXG4gICAgc2Vzc2lvbkRhdGEudXNlcklkID0gdXNlci5pZDtcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IE5leHRSZXNwb25zZS5yZWRpcmVjdChyZWRpcmVjdFVybCk7XHJcbiAgICByZXNwb25zZS5jb29raWVzLnNldCgnc2Vzc2lvbicsIGNyZWF0ZVNlc3Npb25Db29raWUoc2Vzc2lvbkRhdGEpLCB7XHJcbiAgICAgIG1heEFnZTogMzAgKiAyNCAqIDYwICogNjAsIC8vIDMwIGRheXNcclxuICAgICAgaHR0cE9ubHk6IHRydWUsXHJcbiAgICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyxcclxuICAgICAgc2FtZVNpdGU6ICdsYXgnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdHb29nbGUgQXV0aCBDYWxsYmFjayBFcnJvcjonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KGAke3JlZGlyZWN0VXJsfT9lcnJvcj1hdXRoX2ZhaWxlZGApO1xyXG4gIH1cclxufSJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJvYXV0aDJDbGllbnQiLCJjcmVhdGVTZXNzaW9uQ29va2llIiwiZ2V0U2Vzc2lvbkZyb21SZXF1ZXN0IiwicHJpc21hIiwiY3JlYXRlRGVmYXVsdENhdGVnb3JpZXNGb3JVc2VyIiwiaGFzRXhpc3RpbmdDYXRlZ29yaWVzIiwiR0VUIiwicmVxdWVzdCIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsImNvZGUiLCJnZXQiLCJzZXNzaW9uRGF0YSIsInJlZGlyZWN0VXJsIiwiZnJvbnRlbmRPcmlnaW4iLCJwcm9jZXNzIiwiZW52IiwiRlJPTlRFTkRfVVJMIiwicmVkaXJlY3QiLCJ0b2tlbnMiLCJnZXRUb2tlbiIsInNldENyZWRlbnRpYWxzIiwidGlja2V0IiwidmVyaWZ5SWRUb2tlbiIsImlkVG9rZW4iLCJpZF90b2tlbiIsImF1ZGllbmNlIiwiR09PR0xFX0NMSUVOVF9JRCIsInBheWxvYWQiLCJnZXRQYXlsb2FkIiwic3ViIiwiZW1haWwiLCJuYW1lIiwiZXhpc3RpbmdVc2VyIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImdvb2dsZUlkIiwiaXNOZXdVc2VyIiwidXBzZXJ0IiwidXBkYXRlIiwiYXZhdGFyVXJsIiwicGljdHVyZSIsImNyZWF0ZSIsImlkIiwiaGFzQ2F0ZWdvcmllcyIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsInVzZXJJZCIsInJlc3BvbnNlIiwiY29va2llcyIsInNldCIsIm1heEFnZSIsImh0dHBPbmx5Iiwic2VjdXJlIiwic2FtZVNpdGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/google/callback/route.ts\n");

/***/ }),

/***/ "(rsc)/./constants.ts":
/*!**********************!*\
  !*** ./constants.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DEFAULT_CATEGORIES: () => (/* binding */ DEFAULT_CATEGORIES),\n/* harmony export */   MOCK_USER: () => (/* binding */ MOCK_USER),\n/* harmony export */   TASK_STATUS_DISPLAY_NAMES: () => (/* binding */ TASK_STATUS_DISPLAY_NAMES)\n/* harmony export */ });\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ \"(rsc)/./types.ts\");\n\nconst DEFAULT_CATEGORIES = [\n    {\n        id: 'cat-1',\n        name: '업무',\n        color: '#3b82f6',\n        subCategories: [\n            {\n                id: 'sub-1-1',\n                name: '프로젝트 A'\n            },\n            {\n                id: 'sub-1-2',\n                name: '프로젝트 B'\n            }\n        ]\n    },\n    {\n        id: 'cat-2',\n        name: '휴가',\n        color: '#16a34a',\n        subCategories: [\n            {\n                id: 'sub-2-1',\n                name: '연차'\n            },\n            {\n                id: 'sub-2-2',\n                name: '반차'\n            },\n            {\n                id: 'sub-2-3',\n                name: '반반차'\n            }\n        ]\n    },\n    {\n        id: 'cat-3',\n        name: '회의',\n        color: '#f97316',\n        subCategories: [\n            {\n                id: 'sub-3-1',\n                name: '팀 회의'\n            },\n            {\n                id: 'sub-3-2',\n                name: '클라이언트 미팅'\n            }\n        ]\n    },\n    {\n        id: 'cat-4',\n        name: '출장',\n        color: '#9333ea',\n        subCategories: []\n    },\n    {\n        id: 'cat-5',\n        name: '기념일',\n        color: '#db2777',\n        subCategories: [\n            {\n                id: 'sub-5-1',\n                name: '생일'\n            },\n            {\n                id: 'sub-5-2',\n                name: '결혼기념일'\n            }\n        ]\n    },\n    {\n        id: 'cat-6',\n        name: '개인',\n        color: '#64748b',\n        subCategories: [\n            {\n                id: 'sub-6-1',\n                name: '병원'\n            },\n            {\n                id: 'sub-6-2',\n                name: '운동'\n            }\n        ]\n    }\n];\nconst MOCK_USER = {\n    name: 'React User',\n    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'\n};\nconst TASK_STATUS_DISPLAY_NAMES = {\n    [_types__WEBPACK_IMPORTED_MODULE_0__.TaskStatus.ToDo]: 'To Do',\n    [_types__WEBPACK_IMPORTED_MODULE_0__.TaskStatus.InProgress]: 'In Progress',\n    [_types__WEBPACK_IMPORTED_MODULE_0__.TaskStatus.Done]: 'Done'\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9jb25zdGFudHMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNxRDtBQUU5QyxNQUFNQyxxQkFBaUM7SUFDNUM7UUFDRUMsSUFBSTtRQUNKQyxNQUFNO1FBQ05DLE9BQU87UUFDUEMsZUFBZTtZQUNiO2dCQUFFSCxJQUFJO2dCQUFXQyxNQUFNO1lBQVM7WUFDaEM7Z0JBQUVELElBQUk7Z0JBQVdDLE1BQU07WUFBUztTQUNqQztJQUNIO0lBQ0E7UUFDRUQsSUFBSTtRQUNKQyxNQUFNO1FBQ05DLE9BQU87UUFDUEMsZUFBZTtZQUNiO2dCQUFFSCxJQUFJO2dCQUFXQyxNQUFNO1lBQUs7WUFDNUI7Z0JBQUVELElBQUk7Z0JBQVdDLE1BQU07WUFBSztZQUM1QjtnQkFBRUQsSUFBSTtnQkFBV0MsTUFBTTtZQUFNO1NBQzlCO0lBQ0g7SUFDQTtRQUNFRCxJQUFJO1FBQ0pDLE1BQU07UUFDTkMsT0FBTztRQUNQQyxlQUFlO1lBQ2I7Z0JBQUVILElBQUk7Z0JBQVdDLE1BQU07WUFBTztZQUM5QjtnQkFBRUQsSUFBSTtnQkFBV0MsTUFBTTtZQUFXO1NBQ25DO0lBQ0g7SUFDRTtRQUNBRCxJQUFJO1FBQ0pDLE1BQU07UUFDTkMsT0FBTztRQUNQQyxlQUFlLEVBQUU7SUFDbkI7SUFDQTtRQUNFSCxJQUFJO1FBQ0pDLE1BQU07UUFDTkMsT0FBTztRQUNQQyxlQUFlO1lBQ2I7Z0JBQUVILElBQUk7Z0JBQVdDLE1BQU07WUFBSztZQUM1QjtnQkFBRUQsSUFBSTtnQkFBV0MsTUFBTTtZQUFRO1NBQ2hDO0lBQ0g7SUFDQTtRQUNFRCxJQUFJO1FBQ0pDLE1BQU07UUFDTkMsT0FBTztRQUNQQyxlQUFlO1lBQ1g7Z0JBQUVILElBQUk7Z0JBQVdDLE1BQU07WUFBSztZQUM1QjtnQkFBRUQsSUFBSTtnQkFBV0MsTUFBTTtZQUFLO1NBQy9CO0lBQ0g7Q0FDRCxDQUFDO0FBRUssTUFBTUcsWUFBa0I7SUFDM0JILE1BQU07SUFDTkksV0FBVztBQUNmLEVBQUU7QUFFSyxNQUFNQyw0QkFBNkQ7SUFDeEUsQ0FBQ1IsOENBQVVBLENBQUNTLElBQUksQ0FBQyxFQUFFO0lBQ25CLENBQUNULDhDQUFVQSxDQUFDVSxVQUFVLENBQUMsRUFBRTtJQUN6QixDQUFDViw4Q0FBVUEsQ0FBQ1csSUFBSSxDQUFDLEVBQUU7QUFDckIsRUFBRSIsInNvdXJjZXMiOlsiQzpcXGRldlxccHJqXFxzbWFydC1jYWxlbmRhclxcY29uc3RhbnRzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgQ2F0ZWdvcnksIFVzZXIsIFRhc2tTdGF0dXMgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ0FURUdPUklFUzogQ2F0ZWdvcnlbXSA9IFtcbiAge1xuICAgIGlkOiAnY2F0LTEnLFxuICAgIG5hbWU6ICfsl4XrrLQnLFxuICAgIGNvbG9yOiAnIzNiODJmNicsIC8vIGJsdWUtNTAwXG4gICAgc3ViQ2F0ZWdvcmllczogW1xuICAgICAgeyBpZDogJ3N1Yi0xLTEnLCBuYW1lOiAn7ZSE66Gc7KCd7Yq4IEEnIH0sXG4gICAgICB7IGlkOiAnc3ViLTEtMicsIG5hbWU6ICftlITroZzsoJ3tirggQicgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdjYXQtMicsXG4gICAgbmFtZTogJ+2ctOqwgCcsXG4gICAgY29sb3I6ICcjMTZhMzRhJywgLy8gZ3JlZW4tNjAwXG4gICAgc3ViQ2F0ZWdvcmllczogW1xuICAgICAgeyBpZDogJ3N1Yi0yLTEnLCBuYW1lOiAn7Jew7LCoJyB9LFxuICAgICAgeyBpZDogJ3N1Yi0yLTInLCBuYW1lOiAn67CY7LCoJyB9LFxuICAgICAgeyBpZDogJ3N1Yi0yLTMnLCBuYW1lOiAn67CY67CY7LCoJyB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2NhdC0zJyxcbiAgICBuYW1lOiAn7ZqM7J2YJyxcbiAgICBjb2xvcjogJyNmOTczMTYnLCAvLyBvcmFuZ2UtNTAwXG4gICAgc3ViQ2F0ZWdvcmllczogW1xuICAgICAgeyBpZDogJ3N1Yi0zLTEnLCBuYW1lOiAn7YyAIO2ajOydmCcgfSxcbiAgICAgIHsgaWQ6ICdzdWItMy0yJywgbmFtZTogJ+2BtOudvOydtOyWuO2KuCDrr7jtjIUnIH0sXG4gICAgXSxcbiAgfSxcbiAgICB7XG4gICAgaWQ6ICdjYXQtNCcsXG4gICAgbmFtZTogJ+y2nOyepScsXG4gICAgY29sb3I6ICcjOTMzM2VhJywgLy8gcHVycGxlLTYwMFxuICAgIHN1YkNhdGVnb3JpZXM6IFtdLFxuICB9LFxuICB7XG4gICAgaWQ6ICdjYXQtNScsXG4gICAgbmFtZTogJ+q4sOuFkOydvCcsXG4gICAgY29sb3I6ICcjZGIyNzc3JywgLy8gcGluay02MDBcbiAgICBzdWJDYXRlZ29yaWVzOiBbXG4gICAgICB7IGlkOiAnc3ViLTUtMScsIG5hbWU6ICfsg53snbwnIH0sXG4gICAgICB7IGlkOiAnc3ViLTUtMicsIG5hbWU6ICfqsrDtmLzquLDrhZDsnbwnIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnY2F0LTYnLFxuICAgIG5hbWU6ICfqsJzsnbgnLFxuICAgIGNvbG9yOiAnIzY0NzQ4YicsIC8vIHNsYXRlLTUwMFxuICAgIHN1YkNhdGVnb3JpZXM6IFtcbiAgICAgICAgeyBpZDogJ3N1Yi02LTEnLCBuYW1lOiAn67OR7JuQJyB9LFxuICAgICAgICB7IGlkOiAnc3ViLTYtMicsIG5hbWU6ICfsmrTrj5knIH0sXG4gICAgXVxuICB9XG5dO1xuXG5leHBvcnQgY29uc3QgTU9DS19VU0VSOiBVc2VyID0ge1xuICAgIG5hbWU6ICdSZWFjdCBVc2VyJyxcbiAgICBhdmF0YXJVcmw6ICdodHRwczovL2kucHJhdmF0YXIuY2MvMTUwP3U9YTA0MjU4MWY0ZTI5MDI2NzA0ZCdcbn07XG5cbmV4cG9ydCBjb25zdCBUQVNLX1NUQVRVU19ESVNQTEFZX05BTUVTOiB7IFtrZXkgaW4gVGFza1N0YXR1c106IHN0cmluZyB9ID0ge1xuICBbVGFza1N0YXR1cy5Ub0RvXTogJ1RvIERvJyxcbiAgW1Rhc2tTdGF0dXMuSW5Qcm9ncmVzc106ICdJbiBQcm9ncmVzcycsXG4gIFtUYXNrU3RhdHVzLkRvbmVdOiAnRG9uZScsXG59OyJdLCJuYW1lcyI6WyJUYXNrU3RhdHVzIiwiREVGQVVMVF9DQVRFR09SSUVTIiwiaWQiLCJuYW1lIiwiY29sb3IiLCJzdWJDYXRlZ29yaWVzIiwiTU9DS19VU0VSIiwiYXZhdGFyVXJsIiwiVEFTS19TVEFUVVNfRElTUExBWV9OQU1FUyIsIlRvRG8iLCJJblByb2dyZXNzIiwiRG9uZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./constants.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createSessionCookie: () => (/* binding */ createSessionCookie),\n/* harmony export */   getSessionFromRequest: () => (/* binding */ getSessionFromRequest),\n/* harmony export */   getUserFromSession: () => (/* binding */ getUserFromSession),\n/* harmony export */   oauth2Client: () => (/* binding */ oauth2Client)\n/* harmony export */ });\n/* harmony import */ var google_auth_library__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! google-auth-library */ \"(rsc)/./node_modules/.pnpm/google-auth-library@10.2.0/node_modules/google-auth-library/build/src/index.js\");\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./db */ \"(rsc)/./lib/db.ts\");\n\n\nconst oauth2Client = new google_auth_library__WEBPACK_IMPORTED_MODULE_0__.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);\nfunction getSessionFromRequest(request) {\n    try {\n        const sessionCookie = request.cookies.get('session');\n        if (!sessionCookie) return null;\n        // This is a simplified session parsing - in production you might want to use\n        // a more robust session management solution\n        const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());\n        return sessionData;\n    } catch (error) {\n        return null;\n    }\n}\nfunction createSessionCookie(sessionData) {\n    const sessionString = JSON.stringify(sessionData);\n    return Buffer.from(sessionString).toString('base64');\n}\nasync function getUserFromSession(sessionData) {\n    if (!sessionData.userId) return null;\n    try {\n        const user = await _db__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n            where: {\n                id: sessionData.userId\n            }\n        });\n        return user;\n    } catch (error) {\n        console.error('Error getting user from session:', error);\n        return null;\n    }\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDbUQ7QUFDckI7QUFFOUIsTUFBTUUsZUFBZSxJQUFJRiw2REFBWUEsQ0FDbkNHLFFBQVFDLEdBQUcsQ0FBQ0MsZ0JBQWdCLEVBQzVCRixRQUFRQyxHQUFHLENBQUNFLG9CQUFvQixFQUNoQ0gsUUFBUUMsR0FBRyxDQUFDRyxtQkFBbUI7QUFRMUIsU0FBU0Msc0JBQXNCQyxPQUFvQjtJQUN4RCxJQUFJO1FBQ0YsTUFBTUMsZ0JBQWdCRCxRQUFRRSxPQUFPLENBQUNDLEdBQUcsQ0FBQztRQUMxQyxJQUFJLENBQUNGLGVBQWUsT0FBTztRQUUzQiw2RUFBNkU7UUFDN0UsNENBQTRDO1FBQzVDLE1BQU1HLGNBQWNDLEtBQUtDLEtBQUssQ0FBQ0MsT0FBT0MsSUFBSSxDQUFDUCxjQUFjUSxLQUFLLEVBQUUsVUFBVUMsUUFBUTtRQUNsRixPQUFPTjtJQUNULEVBQUUsT0FBT08sT0FBTztRQUNkLE9BQU87SUFDVDtBQUNGO0FBRU8sU0FBU0Msb0JBQW9CUixXQUF3QjtJQUMxRCxNQUFNUyxnQkFBZ0JSLEtBQUtTLFNBQVMsQ0FBQ1Y7SUFDckMsT0FBT0csT0FBT0MsSUFBSSxDQUFDSyxlQUFlSCxRQUFRLENBQUM7QUFDN0M7QUFFTyxlQUFlSyxtQkFBbUJYLFdBQXdCO0lBQy9ELElBQUksQ0FBQ0EsWUFBWVksTUFBTSxFQUFFLE9BQU87SUFFaEMsSUFBSTtRQUNGLE1BQU1DLE9BQU8sTUFBTXpCLHVDQUFNQSxDQUFDeUIsSUFBSSxDQUFDQyxVQUFVLENBQUM7WUFDeENDLE9BQU87Z0JBQUVDLElBQUloQixZQUFZWSxNQUFNO1lBQUM7UUFDbEM7UUFDQSxPQUFPQztJQUNULEVBQUUsT0FBT04sT0FBTztRQUNkVSxRQUFRVixLQUFLLENBQUMsb0NBQW9DQTtRQUNsRCxPQUFPO0lBQ1Q7QUFDRjtBQUV3QiIsInNvdXJjZXMiOlsiQzpcXGRldlxccHJqXFxzbWFydC1jYWxlbmRhclxcbGliXFxhdXRoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0IH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5pbXBvcnQgeyBPQXV0aDJDbGllbnQgfSBmcm9tICdnb29nbGUtYXV0aC1saWJyYXJ5JztcclxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnLi9kYic7XHJcblxyXG5jb25zdCBvYXV0aDJDbGllbnQgPSBuZXcgT0F1dGgyQ2xpZW50KFxyXG4gIHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfSUQsXHJcbiAgcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQsXHJcbiAgcHJvY2Vzcy5lbnYuR09PR0xFX0NBTExCQUNLX1VSTFxyXG4pO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTZXNzaW9uRGF0YSB7XHJcbiAgdXNlcklkPzogc3RyaW5nO1xyXG4gIGZyb250ZW5kT3JpZ2luPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vzc2lvbkZyb21SZXF1ZXN0KHJlcXVlc3Q6IE5leHRSZXF1ZXN0KTogU2Vzc2lvbkRhdGEgfCBudWxsIHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qgc2Vzc2lvbkNvb2tpZSA9IHJlcXVlc3QuY29va2llcy5nZXQoJ3Nlc3Npb24nKTtcclxuICAgIGlmICghc2Vzc2lvbkNvb2tpZSkgcmV0dXJuIG51bGw7XHJcbiAgICBcclxuICAgIC8vIFRoaXMgaXMgYSBzaW1wbGlmaWVkIHNlc3Npb24gcGFyc2luZyAtIGluIHByb2R1Y3Rpb24geW91IG1pZ2h0IHdhbnQgdG8gdXNlXHJcbiAgICAvLyBhIG1vcmUgcm9idXN0IHNlc3Npb24gbWFuYWdlbWVudCBzb2x1dGlvblxyXG4gICAgY29uc3Qgc2Vzc2lvbkRhdGEgPSBKU09OLnBhcnNlKEJ1ZmZlci5mcm9tKHNlc3Npb25Db29raWUudmFsdWUsICdiYXNlNjQnKS50b1N0cmluZygpKTtcclxuICAgIHJldHVybiBzZXNzaW9uRGF0YTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2Vzc2lvbkNvb2tpZShzZXNzaW9uRGF0YTogU2Vzc2lvbkRhdGEpOiBzdHJpbmcge1xyXG4gIGNvbnN0IHNlc3Npb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzZXNzaW9uRGF0YSk7XHJcbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKHNlc3Npb25TdHJpbmcpLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFVzZXJGcm9tU2Vzc2lvbihzZXNzaW9uRGF0YTogU2Vzc2lvbkRhdGEpIHtcclxuICBpZiAoIXNlc3Npb25EYXRhLnVzZXJJZCkgcmV0dXJuIG51bGw7XHJcbiAgXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHsgXHJcbiAgICAgIHdoZXJlOiB7IGlkOiBzZXNzaW9uRGF0YS51c2VySWQgfSBcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHVzZXI7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgdXNlciBmcm9tIHNlc3Npb246JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBvYXV0aDJDbGllbnQgfTsiXSwibmFtZXMiOlsiT0F1dGgyQ2xpZW50IiwicHJpc21hIiwib2F1dGgyQ2xpZW50IiwicHJvY2VzcyIsImVudiIsIkdPT0dMRV9DTElFTlRfSUQiLCJHT09HTEVfQ0xJRU5UX1NFQ1JFVCIsIkdPT0dMRV9DQUxMQkFDS19VUkwiLCJnZXRTZXNzaW9uRnJvbVJlcXVlc3QiLCJyZXF1ZXN0Iiwic2Vzc2lvbkNvb2tpZSIsImNvb2tpZXMiLCJnZXQiLCJzZXNzaW9uRGF0YSIsIkpTT04iLCJwYXJzZSIsIkJ1ZmZlciIsImZyb20iLCJ2YWx1ZSIsInRvU3RyaW5nIiwiZXJyb3IiLCJjcmVhdGVTZXNzaW9uQ29va2llIiwic2Vzc2lvblN0cmluZyIsInN0cmluZ2lmeSIsImdldFVzZXJGcm9tU2Vzc2lvbiIsInVzZXJJZCIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpZCIsImNvbnNvbGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = globalThis.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) {\n    globalThis.prisma = prisma;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQThDO0FBTXZDLE1BQU1DLFNBQVNDLFdBQVdELE1BQU0sSUFBSSxJQUFJRCx3REFBWUEsR0FBRztBQUU5RCxJQUFJRyxJQUFxQyxFQUFFO0lBQ3pDRCxXQUFXRCxNQUFNLEdBQUdBO0FBQ3RCIiwic291cmNlcyI6WyJDOlxcZGV2XFxwcmpcXHNtYXJ0LWNhbGVuZGFyXFxsaWJcXGRiLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICB2YXIgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxUaGlzLnByaXNtYSB8fCBuZXcgUHJpc21hQ2xpZW50KCk7XHJcblxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xyXG4gIGdsb2JhbFRoaXMucHJpc21hID0gcHJpc21hO1xyXG59Il0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsInByaXNtYSIsImdsb2JhbFRoaXMiLCJwcm9jZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./lib/defaultCategories.ts":
/*!**********************************!*\
  !*** ./lib/defaultCategories.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createDefaultCategoriesForUser: () => (/* binding */ createDefaultCategoriesForUser),\n/* harmony export */   hasExistingCategories: () => (/* binding */ hasExistingCategories)\n/* harmony export */ });\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ \"(rsc)/./constants.ts\");\n\n\nasync function createDefaultCategoriesForUser(userId) {\n    try {\n        // 트랜잭션을 사용하여 모든 카테고리와 서브카테고리를 한 번에 생성\n        await _db__WEBPACK_IMPORTED_MODULE_0__.prisma.$transaction(async (tx)=>{\n            for (const category of _constants__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_CATEGORIES){\n                // 카테고리 생성\n                const createdCategory = await tx.category.create({\n                    data: {\n                        id: `${userId}_${category.id}`,\n                        name: category.name,\n                        color: category.color,\n                        userId: userId\n                    }\n                });\n                // 서브카테고리 생성\n                if (category.subCategories && category.subCategories.length > 0) {\n                    for (const subCategory of category.subCategories){\n                        await tx.subCategory.create({\n                            data: {\n                                id: `${userId}_${subCategory.id}`,\n                                name: subCategory.name,\n                                categoryId: createdCategory.id\n                            }\n                        });\n                    }\n                }\n            }\n        });\n        console.log(`Default categories created for user: ${userId}`);\n    } catch (error) {\n        console.error('Error creating default categories:', error);\n        throw error;\n    }\n}\nasync function hasExistingCategories(userId) {\n    try {\n        const count = await _db__WEBPACK_IMPORTED_MODULE_0__.prisma.category.count({\n            where: {\n                userId: userId\n            }\n        });\n        return count > 0;\n    } catch (error) {\n        console.error('Error checking existing categories:', error);\n        return false;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGVmYXVsdENhdGVnb3JpZXMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUE4QjtBQUNvQjtBQUUzQyxlQUFlRSwrQkFBK0JDLE1BQWM7SUFDakUsSUFBSTtRQUNGLHNDQUFzQztRQUN0QyxNQUFNSCx1Q0FBTUEsQ0FBQ0ksWUFBWSxDQUFDLE9BQU9DO1lBQy9CLEtBQUssTUFBTUMsWUFBWUwsMERBQWtCQSxDQUFFO2dCQUN6QyxVQUFVO2dCQUNWLE1BQU1NLGtCQUFrQixNQUFNRixHQUFHQyxRQUFRLENBQUNFLE1BQU0sQ0FBQztvQkFDL0NDLE1BQU07d0JBQ0pDLElBQUksR0FBR1AsT0FBTyxDQUFDLEVBQUVHLFNBQVNJLEVBQUUsRUFBRTt3QkFDOUJDLE1BQU1MLFNBQVNLLElBQUk7d0JBQ25CQyxPQUFPTixTQUFTTSxLQUFLO3dCQUNyQlQsUUFBUUE7b0JBQ1Y7Z0JBQ0Y7Z0JBRUEsWUFBWTtnQkFDWixJQUFJRyxTQUFTTyxhQUFhLElBQUlQLFNBQVNPLGFBQWEsQ0FBQ0MsTUFBTSxHQUFHLEdBQUc7b0JBQy9ELEtBQUssTUFBTUMsZUFBZVQsU0FBU08sYUFBYSxDQUFFO3dCQUNoRCxNQUFNUixHQUFHVSxXQUFXLENBQUNQLE1BQU0sQ0FBQzs0QkFDMUJDLE1BQU07Z0NBQ0pDLElBQUksR0FBR1AsT0FBTyxDQUFDLEVBQUVZLFlBQVlMLEVBQUUsRUFBRTtnQ0FDakNDLE1BQU1JLFlBQVlKLElBQUk7Z0NBQ3RCSyxZQUFZVCxnQkFBZ0JHLEVBQUU7NEJBQ2hDO3dCQUNGO29CQUNGO2dCQUNGO1lBQ0Y7UUFDRjtRQUVBTyxRQUFRQyxHQUFHLENBQUMsQ0FBQyxxQ0FBcUMsRUFBRWYsUUFBUTtJQUM5RCxFQUFFLE9BQU9nQixPQUFPO1FBQ2RGLFFBQVFFLEtBQUssQ0FBQyxzQ0FBc0NBO1FBQ3BELE1BQU1BO0lBQ1I7QUFDRjtBQUVPLGVBQWVDLHNCQUFzQmpCLE1BQWM7SUFDeEQsSUFBSTtRQUNGLE1BQU1rQixRQUFRLE1BQU1yQix1Q0FBTUEsQ0FBQ00sUUFBUSxDQUFDZSxLQUFLLENBQUM7WUFDeENDLE9BQU87Z0JBQUVuQixRQUFRQTtZQUFPO1FBQzFCO1FBQ0EsT0FBT2tCLFFBQVE7SUFDakIsRUFBRSxPQUFPRixPQUFPO1FBQ2RGLFFBQVFFLEtBQUssQ0FBQyx1Q0FBdUNBO1FBQ3JELE9BQU87SUFDVDtBQUNGIiwic291cmNlcyI6WyJDOlxcZGV2XFxwcmpcXHNtYXJ0LWNhbGVuZGFyXFxsaWJcXGRlZmF1bHRDYXRlZ29yaWVzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4vZGInO1xyXG5pbXBvcnQgeyBERUZBVUxUX0NBVEVHT1JJRVMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRDYXRlZ29yaWVzRm9yVXNlcih1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gIHRyeSB7XHJcbiAgICAvLyDtirjrnpzsnq3shZjsnYQg7IKs7Jqp7ZWY7JesIOuqqOuToCDsubTthYzqs6DrpqzsmYAg7ISc67iM7Lm07YWM6rOg66as66W8IO2VnCDrsojsl5Ag7IOd7ISxXHJcbiAgICBhd2FpdCBwcmlzbWEuJHRyYW5zYWN0aW9uKGFzeW5jICh0eCkgPT4ge1xyXG4gICAgICBmb3IgKGNvbnN0IGNhdGVnb3J5IG9mIERFRkFVTFRfQ0FURUdPUklFUykge1xyXG4gICAgICAgIC8vIOy5tO2FjOqzoOumrCDsg53shLFcclxuICAgICAgICBjb25zdCBjcmVhdGVkQ2F0ZWdvcnkgPSBhd2FpdCB0eC5jYXRlZ29yeS5jcmVhdGUoe1xyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBpZDogYCR7dXNlcklkfV8ke2NhdGVnb3J5LmlkfWAsIC8vIOyCrOyaqeyekOuzhCDqs6DsnKAgSURcclxuICAgICAgICAgICAgbmFtZTogY2F0ZWdvcnkubmFtZSxcclxuICAgICAgICAgICAgY29sb3I6IGNhdGVnb3J5LmNvbG9yLFxyXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOyEnOu4jOy5tO2FjOqzoOumrCDsg53shLFcclxuICAgICAgICBpZiAoY2F0ZWdvcnkuc3ViQ2F0ZWdvcmllcyAmJiBjYXRlZ29yeS5zdWJDYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvciAoY29uc3Qgc3ViQ2F0ZWdvcnkgb2YgY2F0ZWdvcnkuc3ViQ2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICBhd2FpdCB0eC5zdWJDYXRlZ29yeS5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGlkOiBgJHt1c2VySWR9XyR7c3ViQ2F0ZWdvcnkuaWR9YCwgLy8g7IKs7Jqp7J6Q67OEIOqzoOycoCBJRFxyXG4gICAgICAgICAgICAgICAgbmFtZTogc3ViQ2F0ZWdvcnkubmFtZSxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5SWQ6IGNyZWF0ZWRDYXRlZ29yeS5pZCxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBEZWZhdWx0IGNhdGVnb3JpZXMgY3JlYXRlZCBmb3IgdXNlcjogJHt1c2VySWR9YCk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIGRlZmF1bHQgY2F0ZWdvcmllczonLCBlcnJvcik7XHJcbiAgICB0aHJvdyBlcnJvcjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYXNFeGlzdGluZ0NhdGVnb3JpZXModXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgY291bnQgPSBhd2FpdCBwcmlzbWEuY2F0ZWdvcnkuY291bnQoe1xyXG4gICAgICB3aGVyZTogeyB1c2VySWQ6IHVzZXJJZCB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjb3VudCA+IDA7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNoZWNraW5nIGV4aXN0aW5nIGNhdGVnb3JpZXM6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufSJdLCJuYW1lcyI6WyJwcmlzbWEiLCJERUZBVUxUX0NBVEVHT1JJRVMiLCJjcmVhdGVEZWZhdWx0Q2F0ZWdvcmllc0ZvclVzZXIiLCJ1c2VySWQiLCIkdHJhbnNhY3Rpb24iLCJ0eCIsImNhdGVnb3J5IiwiY3JlYXRlZENhdGVnb3J5IiwiY3JlYXRlIiwiZGF0YSIsImlkIiwibmFtZSIsImNvbG9yIiwic3ViQ2F0ZWdvcmllcyIsImxlbmd0aCIsInN1YkNhdGVnb3J5IiwiY2F0ZWdvcnlJZCIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsImhhc0V4aXN0aW5nQ2F0ZWdvcmllcyIsImNvdW50Iiwid2hlcmUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/defaultCategories.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&page=%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute.ts&appDir=C%3A%5Cdev%5Cprj%5Csmart-calendar%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cdev%5Cprj%5Csmart-calendar&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&page=%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute.ts&appDir=C%3A%5Cdev%5Cprj%5Csmart-calendar%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cdev%5Cprj%5Csmart-calendar&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handler: () => (/* binding */ handler),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/request-meta */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/request-meta.js\");\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/dist/server/lib/trace/tracer */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/trace/tracer.js\");\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/dist/shared/lib/router/utils/app-paths */ \"next/dist/shared/lib/router/utils/app-paths\");\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/dist/server/base-http/node */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/base-http/node.js\");\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/dist/server/web/spec-extension/adapters/next-request */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/web/spec-extension/adapters/next-request.js\");\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/dist/server/lib/trace/constants */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/trace/constants.js\");\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! next/dist/server/instrumentation/utils */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/instrumentation/utils.js\");\n/* harmony import */ var next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! next/dist/server/send-response */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/send-response.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/dist/server/web/utils */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/web/utils.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! next/dist/server/lib/cache-control */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/cache-control.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! next/dist/lib/constants */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/lib/constants.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! next/dist/shared/lib/no-fallback-error.external */ \"next/dist/shared/lib/no-fallback-error.external\");\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! next/dist/server/response-cache */ \"(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/response-cache/index.js\");\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var C_dev_prj_smart_calendar_app_api_auth_google_callback_route_ts__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app/api/auth/google/callback/route.ts */ \"(rsc)/./app/api/auth/google/callback/route.ts\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/google/callback/route\",\n        pathname: \"/api/auth/google/callback\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/google/callback/route\"\n    },\n    distDir: \".next\" || 0,\n    projectDir:  false || '',\n    resolvedPagePath: \"C:\\\\dev\\\\prj\\\\smart-calendar\\\\app\\\\api\\\\auth\\\\google\\\\callback\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_dev_prj_smart_calendar_app_api_auth_google_callback_route_ts__WEBPACK_IMPORTED_MODULE_16__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\nasync function handler(req, res, ctx) {\n    var _nextConfig_experimental;\n    let srcPage = \"/api/auth/google/callback/route\";\n    // turbopack doesn't normalize `/index` in the page name\n    // so we need to to process dynamic routes properly\n    // TODO: fix turbopack providing differing value from webpack\n    if (false) {} else if (srcPage === '/index') {\n        // we always normalize /index specifically\n        srcPage = '/';\n    }\n    const multiZoneDraftMode = \"false\";\n    const prepareResult = await routeModule.prepare(req, res, {\n        srcPage,\n        multiZoneDraftMode\n    });\n    if (!prepareResult) {\n        res.statusCode = 400;\n        res.end('Bad Request');\n        ctx.waitUntil == null ? void 0 : ctx.waitUntil.call(ctx, Promise.resolve());\n        return null;\n    }\n    const { buildId, params, nextConfig, isDraftMode, prerenderManifest, routerServerContext, isOnDemandRevalidate, revalidateOnlyGenerated, resolvedPathname } = prepareResult;\n    const normalizedSrcPage = (0,next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__.normalizeAppPath)(srcPage);\n    let isIsr = Boolean(prerenderManifest.dynamicRoutes[normalizedSrcPage] || prerenderManifest.routes[resolvedPathname]);\n    if (isIsr && !isDraftMode) {\n        const isPrerendered = Boolean(prerenderManifest.routes[resolvedPathname]);\n        const prerenderInfo = prerenderManifest.dynamicRoutes[normalizedSrcPage];\n        if (prerenderInfo) {\n            if (prerenderInfo.fallback === false && !isPrerendered) {\n                throw new next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError();\n            }\n        }\n    }\n    let cacheKey = null;\n    if (isIsr && !routeModule.isDev && !isDraftMode) {\n        cacheKey = resolvedPathname;\n        // ensure /index and / is normalized to one key\n        cacheKey = cacheKey === '/index' ? '/' : cacheKey;\n    }\n    const supportsDynamicResponse = // If we're in development, we always support dynamic HTML\n    routeModule.isDev === true || // If this is not SSG or does not have static paths, then it supports\n    // dynamic HTML.\n    !isIsr;\n    // This is a revalidation request if the request is for a static\n    // page and it is not being resumed from a postponed render and\n    // it is not a dynamic RSC request then it is a revalidation\n    // request.\n    const isRevalidate = isIsr && !supportsDynamicResponse;\n    const method = req.method || 'GET';\n    const tracer = (0,next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.getTracer)();\n    const activeSpan = tracer.getActiveScopeSpan();\n    const context = {\n        params,\n        prerenderManifest,\n        renderOpts: {\n            experimental: {\n                dynamicIO: Boolean(nextConfig.experimental.dynamicIO),\n                authInterrupts: Boolean(nextConfig.experimental.authInterrupts)\n            },\n            supportsDynamicResponse,\n            incrementalCache: (0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'incrementalCache'),\n            cacheLifeProfiles: (_nextConfig_experimental = nextConfig.experimental) == null ? void 0 : _nextConfig_experimental.cacheLife,\n            isRevalidate,\n            waitUntil: ctx.waitUntil,\n            onClose: (cb)=>{\n                res.on('close', cb);\n            },\n            onAfterTaskError: undefined,\n            onInstrumentationRequestError: (error, _request, errorContext)=>routeModule.onRequestError(req, error, errorContext, routerServerContext)\n        },\n        sharedContext: {\n            buildId\n        }\n    };\n    const nodeNextReq = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextRequest(req);\n    const nodeNextRes = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextResponse(res);\n    const nextReq = next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.NextRequestAdapter.fromNodeNextRequest(nodeNextReq, (0,next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.signalFromNodeResponse)(res));\n    try {\n        const invokeRouteModule = async (span)=>{\n            return routeModule.handle(nextReq, context).finally(()=>{\n                if (!span) return;\n                span.setAttributes({\n                    'http.status_code': res.statusCode,\n                    'next.rsc': false\n                });\n                const rootSpanAttributes = tracer.getRootSpanAttributes();\n                // We were unable to get attributes, probably OTEL is not enabled\n                if (!rootSpanAttributes) {\n                    return;\n                }\n                if (rootSpanAttributes.get('next.span_type') !== next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest) {\n                    console.warn(`Unexpected root span type '${rootSpanAttributes.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`);\n                    return;\n                }\n                const route = rootSpanAttributes.get('next.route');\n                if (route) {\n                    const name = `${method} ${route}`;\n                    span.setAttributes({\n                        'next.route': route,\n                        'http.route': route,\n                        'next.span_name': name\n                    });\n                    span.updateName(name);\n                } else {\n                    span.updateName(`${method} ${req.url}`);\n                }\n            });\n        };\n        const handleResponse = async (currentSpan)=>{\n            var _cacheEntry_value;\n            const responseGenerator = async ({ previousCacheEntry })=>{\n                try {\n                    if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isOnDemandRevalidate && revalidateOnlyGenerated && !previousCacheEntry) {\n                        res.statusCode = 404;\n                        // on-demand revalidate always sets this header\n                        res.setHeader('x-nextjs-cache', 'REVALIDATED');\n                        res.end('This page could not be found');\n                        return null;\n                    }\n                    const response = await invokeRouteModule(currentSpan);\n                    req.fetchMetrics = context.renderOpts.fetchMetrics;\n                    let pendingWaitUntil = context.renderOpts.pendingWaitUntil;\n                    // Attempt using provided waitUntil if available\n                    // if it's not we fallback to sendResponse's handling\n                    if (pendingWaitUntil) {\n                        if (ctx.waitUntil) {\n                            ctx.waitUntil(pendingWaitUntil);\n                            pendingWaitUntil = undefined;\n                        }\n                    }\n                    const cacheTags = context.renderOpts.collectedTags;\n                    // If the request is for a static response, we can cache it so long\n                    // as it's not edge.\n                    if (isIsr) {\n                        const blob = await response.blob();\n                        // Copy the headers from the response.\n                        const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.toNodeOutgoingHttpHeaders)(response.headers);\n                        if (cacheTags) {\n                            headers[next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER] = cacheTags;\n                        }\n                        if (!headers['content-type'] && blob.type) {\n                            headers['content-type'] = blob.type;\n                        }\n                        const revalidate = typeof context.renderOpts.collectedRevalidate === 'undefined' || context.renderOpts.collectedRevalidate >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? false : context.renderOpts.collectedRevalidate;\n                        const expire = typeof context.renderOpts.collectedExpire === 'undefined' || context.renderOpts.collectedExpire >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? undefined : context.renderOpts.collectedExpire;\n                        // Create the cache entry for the response.\n                        const cacheEntry = {\n                            value: {\n                                kind: next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE,\n                                status: response.status,\n                                body: Buffer.from(await blob.arrayBuffer()),\n                                headers\n                            },\n                            cacheControl: {\n                                revalidate,\n                                expire\n                            }\n                        };\n                        return cacheEntry;\n                    } else {\n                        // send response without caching if not ISR\n                        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, response, context.renderOpts.pendingWaitUntil);\n                        return null;\n                    }\n                } catch (err) {\n                    // if this is a background revalidate we need to report\n                    // the request error here as it won't be bubbled\n                    if (previousCacheEntry == null ? void 0 : previousCacheEntry.isStale) {\n                        await routeModule.onRequestError(req, err, {\n                            routerKind: 'App Router',\n                            routePath: srcPage,\n                            routeType: 'route',\n                            revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                                isRevalidate,\n                                isOnDemandRevalidate\n                            })\n                        }, routerServerContext);\n                    }\n                    throw err;\n                }\n            };\n            const cacheEntry = await routeModule.handleResponse({\n                req,\n                nextConfig,\n                cacheKey,\n                routeKind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n                isFallback: false,\n                prerenderManifest,\n                isRoutePPREnabled: false,\n                isOnDemandRevalidate,\n                revalidateOnlyGenerated,\n                responseGenerator,\n                waitUntil: ctx.waitUntil\n            });\n            // we don't create a cacheEntry for ISR\n            if (!isIsr) {\n                return null;\n            }\n            if ((cacheEntry == null ? void 0 : (_cacheEntry_value = cacheEntry.value) == null ? void 0 : _cacheEntry_value.kind) !== next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE) {\n                var _cacheEntry_value1;\n                throw Object.defineProperty(new Error(`Invariant: app-route received invalid cache entry ${cacheEntry == null ? void 0 : (_cacheEntry_value1 = cacheEntry.value) == null ? void 0 : _cacheEntry_value1.kind}`), \"__NEXT_ERROR_CODE\", {\n                    value: \"E701\",\n                    enumerable: false,\n                    configurable: true\n                });\n            }\n            if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode')) {\n                res.setHeader('x-nextjs-cache', isOnDemandRevalidate ? 'REVALIDATED' : cacheEntry.isMiss ? 'MISS' : cacheEntry.isStale ? 'STALE' : 'HIT');\n            }\n            // Draft mode should never be cached\n            if (isDraftMode) {\n                res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');\n            }\n            const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.fromNodeOutgoingHttpHeaders)(cacheEntry.value.headers);\n            if (!((0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isIsr)) {\n                headers.delete(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER);\n            }\n            // If cache control is already set on the response we don't\n            // override it to allow users to customize it via next.config\n            if (cacheEntry.cacheControl && !res.getHeader('Cache-Control') && !headers.get('Cache-Control')) {\n                headers.set('Cache-Control', (0,next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__.getCacheControlHeader)(cacheEntry.cacheControl));\n            }\n            await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(cacheEntry.value.body, {\n                headers,\n                status: cacheEntry.value.status || 200\n            }));\n            return null;\n        };\n        // TODO: activeSpan code path is for when wrapped by\n        // next-server can be removed when this is no longer used\n        if (activeSpan) {\n            await handleResponse(activeSpan);\n        } else {\n            await tracer.withPropagatedContext(req.headers, ()=>tracer.trace(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest, {\n                    spanName: `${method} ${req.url}`,\n                    kind: next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.SpanKind.SERVER,\n                    attributes: {\n                        'http.method': method,\n                        'http.target': req.url\n                    }\n                }, handleResponse));\n        }\n    } catch (err) {\n        // if we aren't wrapped by base-server handle here\n        if (!activeSpan && !(err instanceof next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError)) {\n            await routeModule.onRequestError(req, err, {\n                routerKind: 'App Router',\n                routePath: normalizedSrcPage,\n                routeType: 'route',\n                revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                    isRevalidate,\n                    isOnDemandRevalidate\n                })\n            });\n        }\n        // rethrow so that we can handle serving error page\n        // If this is during static generation, throw the error again.\n        if (isIsr) throw err;\n        // Otherwise, send a 500 response.\n        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(null, {\n            status: 500\n        }));\n        return null;\n    }\n}\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS40LjRfcmVhY3QtZG9tQDE5LjEuMF9yZWFjdEAxOS4xLjBfX3JlYWN0QDE5LjEuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGZ29vZ2xlJTJGY2FsbGJhY2slMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZnb29nbGUlMkZjYWxsYmFjayUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZnb29nbGUlMkZjYWxsYmFjayUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDZGV2JTVDcHJqJTVDc21hcnQtY2FsZW5kYXIlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNkZXYlNUNwcmolNUNzbWFydC1jYWxlbmRhciZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCZpc0dsb2JhbE5vdEZvdW5kRW5hYmxlZD0hIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2Q7QUFDUztBQUNPO0FBQ0s7QUFDbUM7QUFDakQ7QUFDTztBQUNmO0FBQ3NDO0FBQ3pCO0FBQ007QUFDQztBQUNoQjtBQUNtQztBQUNyRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxhQUFhLE9BQW9DLElBQUksQ0FBRTtBQUN2RCxnQkFBZ0IsTUFBdUM7QUFDdkQ7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7QUFDbkY7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUFxQixFQUFFLEVBRTFCLENBQUM7QUFDTjtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsT0FBd0M7QUFDdkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0pBQW9KO0FBQ2hLLDhCQUE4Qiw2RkFBZ0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDZGQUFlO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDRFQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSw4QkFBOEIsNkVBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDRFQUFlO0FBQzNDLDRCQUE0Qiw2RUFBZ0I7QUFDNUMsb0JBQW9CLHlHQUFrQixrQ0FBa0MsaUhBQXNCO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsZ0ZBQWM7QUFDL0UsK0RBQStELHlDQUF5QztBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxRQUFRLEVBQUUsTUFBTTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGtCQUFrQjtBQUNsQix1Q0FBdUMsUUFBUSxFQUFFLFFBQVE7QUFDekQ7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLG9CQUFvQjtBQUNuRTtBQUNBLHlCQUF5Qiw2RUFBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLHNGQUF5QjtBQUNqRTtBQUNBLG9DQUFvQyw0RUFBc0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzSkFBc0osb0VBQWM7QUFDcEssMElBQTBJLG9FQUFjO0FBQ3hKO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyw2RUFBZTtBQUNyRDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EsOEJBQThCLDZFQUFZO0FBQzFDO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsMkZBQW1CO0FBQ2pFO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsa0VBQVM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxSUFBcUksNkVBQWU7QUFDcEo7QUFDQSwyR0FBMkcsaUhBQWlIO0FBQzVOO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQiw2RUFBYztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0ZBQTJCO0FBQ3ZELGtCQUFrQiw2RUFBYztBQUNoQywrQkFBK0IsNEVBQXNCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLDBGQUFxQjtBQUNsRTtBQUNBLGtCQUFrQiw2RUFBWTtBQUM5QjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViw2RUFBNkUsZ0ZBQWM7QUFDM0YsaUNBQWlDLFFBQVEsRUFBRSxRQUFRO0FBQ25ELDBCQUEwQix1RUFBUTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLE1BQU07QUFDTjtBQUNBLDRDQUE0Qyw2RkFBZTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyRkFBbUI7QUFDckQ7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsNkVBQVk7QUFDMUI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0IHsgZ2V0UmVxdWVzdE1ldGEgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yZXF1ZXN0LW1ldGFcIjtcbmltcG9ydCB7IGdldFRyYWNlciwgU3BhbktpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvdHJhY2UvdHJhY2VyXCI7XG5pbXBvcnQgeyBub3JtYWxpemVBcHBQYXRoIH0gZnJvbSBcIm5leHQvZGlzdC9zaGFyZWQvbGliL3JvdXRlci91dGlscy9hcHAtcGF0aHNcIjtcbmltcG9ydCB7IE5vZGVOZXh0UmVxdWVzdCwgTm9kZU5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Jhc2UtaHR0cC9ub2RlXCI7XG5pbXBvcnQgeyBOZXh0UmVxdWVzdEFkYXB0ZXIsIHNpZ25hbEZyb21Ob2RlUmVzcG9uc2UgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci93ZWIvc3BlYy1leHRlbnNpb24vYWRhcHRlcnMvbmV4dC1yZXF1ZXN0XCI7XG5pbXBvcnQgeyBCYXNlU2VydmVyU3BhbiB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi90cmFjZS9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldFJldmFsaWRhdGVSZWFzb24gfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9pbnN0cnVtZW50YXRpb24vdXRpbHNcIjtcbmltcG9ydCB7IHNlbmRSZXNwb25zZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3NlbmQtcmVzcG9uc2VcIjtcbmltcG9ydCB7IGZyb21Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycywgdG9Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3dlYi91dGlsc1wiO1xuaW1wb3J0IHsgZ2V0Q2FjaGVDb250cm9sSGVhZGVyIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL2NhY2hlLWNvbnRyb2xcIjtcbmltcG9ydCB7IElORklOSVRFX0NBQ0hFLCBORVhUX0NBQ0hFX1RBR1NfSEVBREVSIH0gZnJvbSBcIm5leHQvZGlzdC9saWIvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBOb0ZhbGxiYWNrRXJyb3IgfSBmcm9tIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvbm8tZmFsbGJhY2stZXJyb3IuZXh0ZXJuYWxcIjtcbmltcG9ydCB7IENhY2hlZFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3Jlc3BvbnNlLWNhY2hlXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcZGV2XFxcXHByalxcXFxzbWFydC1jYWxlbmRhclxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcZ29vZ2xlXFxcXGNhbGxiYWNrXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL2dvb2dsZS9jYWxsYmFjay9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvZ29vZ2xlL2NhbGxiYWNrXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL2dvb2dsZS9jYWxsYmFjay9yb3V0ZVwiXG4gICAgfSxcbiAgICBkaXN0RGlyOiBwcm9jZXNzLmVudi5fX05FWFRfUkVMQVRJVkVfRElTVF9ESVIgfHwgJycsXG4gICAgcHJvamVjdERpcjogcHJvY2Vzcy5lbnYuX19ORVhUX1JFTEFUSVZFX1BST0pFQ1RfRElSIHx8ICcnLFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcZGV2XFxcXHByalxcXFxzbWFydC1jYWxlbmRhclxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcZ29vZ2xlXFxcXGNhbGxiYWNrXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMsIGN0eCkge1xuICAgIHZhciBfbmV4dENvbmZpZ19leHBlcmltZW50YWw7XG4gICAgbGV0IHNyY1BhZ2UgPSBcIi9hcGkvYXV0aC9nb29nbGUvY2FsbGJhY2svcm91dGVcIjtcbiAgICAvLyB0dXJib3BhY2sgZG9lc24ndCBub3JtYWxpemUgYC9pbmRleGAgaW4gdGhlIHBhZ2UgbmFtZVxuICAgIC8vIHNvIHdlIG5lZWQgdG8gdG8gcHJvY2VzcyBkeW5hbWljIHJvdXRlcyBwcm9wZXJseVxuICAgIC8vIFRPRE86IGZpeCB0dXJib3BhY2sgcHJvdmlkaW5nIGRpZmZlcmluZyB2YWx1ZSBmcm9tIHdlYnBhY2tcbiAgICBpZiAocHJvY2Vzcy5lbnYuVFVSQk9QQUNLKSB7XG4gICAgICAgIHNyY1BhZ2UgPSBzcmNQYWdlLnJlcGxhY2UoL1xcL2luZGV4JC8sICcnKSB8fCAnLyc7XG4gICAgfSBlbHNlIGlmIChzcmNQYWdlID09PSAnL2luZGV4Jykge1xuICAgICAgICAvLyB3ZSBhbHdheXMgbm9ybWFsaXplIC9pbmRleCBzcGVjaWZpY2FsbHlcbiAgICAgICAgc3JjUGFnZSA9ICcvJztcbiAgICB9XG4gICAgY29uc3QgbXVsdGlab25lRHJhZnRNb2RlID0gcHJvY2Vzcy5lbnYuX19ORVhUX01VTFRJX1pPTkVfRFJBRlRfTU9ERTtcbiAgICBjb25zdCBwcmVwYXJlUmVzdWx0ID0gYXdhaXQgcm91dGVNb2R1bGUucHJlcGFyZShyZXEsIHJlcywge1xuICAgICAgICBzcmNQYWdlLFxuICAgICAgICBtdWx0aVpvbmVEcmFmdE1vZGVcbiAgICB9KTtcbiAgICBpZiAoIXByZXBhcmVSZXN1bHQpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgIHJlcy5lbmQoJ0JhZCBSZXF1ZXN0Jyk7XG4gICAgICAgIGN0eC53YWl0VW50aWwgPT0gbnVsbCA/IHZvaWQgMCA6IGN0eC53YWl0VW50aWwuY2FsbChjdHgsIFByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHsgYnVpbGRJZCwgcGFyYW1zLCBuZXh0Q29uZmlnLCBpc0RyYWZ0TW9kZSwgcHJlcmVuZGVyTWFuaWZlc3QsIHJvdXRlclNlcnZlckNvbnRleHQsIGlzT25EZW1hbmRSZXZhbGlkYXRlLCByZXZhbGlkYXRlT25seUdlbmVyYXRlZCwgcmVzb2x2ZWRQYXRobmFtZSB9ID0gcHJlcGFyZVJlc3VsdDtcbiAgICBjb25zdCBub3JtYWxpemVkU3JjUGFnZSA9IG5vcm1hbGl6ZUFwcFBhdGgoc3JjUGFnZSk7XG4gICAgbGV0IGlzSXNyID0gQm9vbGVhbihwcmVyZW5kZXJNYW5pZmVzdC5keW5hbWljUm91dGVzW25vcm1hbGl6ZWRTcmNQYWdlXSB8fCBwcmVyZW5kZXJNYW5pZmVzdC5yb3V0ZXNbcmVzb2x2ZWRQYXRobmFtZV0pO1xuICAgIGlmIChpc0lzciAmJiAhaXNEcmFmdE1vZGUpIHtcbiAgICAgICAgY29uc3QgaXNQcmVyZW5kZXJlZCA9IEJvb2xlYW4ocHJlcmVuZGVyTWFuaWZlc3Qucm91dGVzW3Jlc29sdmVkUGF0aG5hbWVdKTtcbiAgICAgICAgY29uc3QgcHJlcmVuZGVySW5mbyA9IHByZXJlbmRlck1hbmlmZXN0LmR5bmFtaWNSb3V0ZXNbbm9ybWFsaXplZFNyY1BhZ2VdO1xuICAgICAgICBpZiAocHJlcmVuZGVySW5mbykge1xuICAgICAgICAgICAgaWYgKHByZXJlbmRlckluZm8uZmFsbGJhY2sgPT09IGZhbHNlICYmICFpc1ByZXJlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE5vRmFsbGJhY2tFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBjYWNoZUtleSA9IG51bGw7XG4gICAgaWYgKGlzSXNyICYmICFyb3V0ZU1vZHVsZS5pc0RldiAmJiAhaXNEcmFmdE1vZGUpIHtcbiAgICAgICAgY2FjaGVLZXkgPSByZXNvbHZlZFBhdGhuYW1lO1xuICAgICAgICAvLyBlbnN1cmUgL2luZGV4IGFuZCAvIGlzIG5vcm1hbGl6ZWQgdG8gb25lIGtleVxuICAgICAgICBjYWNoZUtleSA9IGNhY2hlS2V5ID09PSAnL2luZGV4JyA/ICcvJyA6IGNhY2hlS2V5O1xuICAgIH1cbiAgICBjb25zdCBzdXBwb3J0c0R5bmFtaWNSZXNwb25zZSA9IC8vIElmIHdlJ3JlIGluIGRldmVsb3BtZW50LCB3ZSBhbHdheXMgc3VwcG9ydCBkeW5hbWljIEhUTUxcbiAgICByb3V0ZU1vZHVsZS5pc0RldiA9PT0gdHJ1ZSB8fCAvLyBJZiB0aGlzIGlzIG5vdCBTU0cgb3IgZG9lcyBub3QgaGF2ZSBzdGF0aWMgcGF0aHMsIHRoZW4gaXQgc3VwcG9ydHNcbiAgICAvLyBkeW5hbWljIEhUTUwuXG4gICAgIWlzSXNyO1xuICAgIC8vIFRoaXMgaXMgYSByZXZhbGlkYXRpb24gcmVxdWVzdCBpZiB0aGUgcmVxdWVzdCBpcyBmb3IgYSBzdGF0aWNcbiAgICAvLyBwYWdlIGFuZCBpdCBpcyBub3QgYmVpbmcgcmVzdW1lZCBmcm9tIGEgcG9zdHBvbmVkIHJlbmRlciBhbmRcbiAgICAvLyBpdCBpcyBub3QgYSBkeW5hbWljIFJTQyByZXF1ZXN0IHRoZW4gaXQgaXMgYSByZXZhbGlkYXRpb25cbiAgICAvLyByZXF1ZXN0LlxuICAgIGNvbnN0IGlzUmV2YWxpZGF0ZSA9IGlzSXNyICYmICFzdXBwb3J0c0R5bmFtaWNSZXNwb25zZTtcbiAgICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kIHx8ICdHRVQnO1xuICAgIGNvbnN0IHRyYWNlciA9IGdldFRyYWNlcigpO1xuICAgIGNvbnN0IGFjdGl2ZVNwYW4gPSB0cmFjZXIuZ2V0QWN0aXZlU2NvcGVTcGFuKCk7XG4gICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICBwcmVyZW5kZXJNYW5pZmVzdCxcbiAgICAgICAgcmVuZGVyT3B0czoge1xuICAgICAgICAgICAgZXhwZXJpbWVudGFsOiB7XG4gICAgICAgICAgICAgICAgZHluYW1pY0lPOiBCb29sZWFuKG5leHRDb25maWcuZXhwZXJpbWVudGFsLmR5bmFtaWNJTyksXG4gICAgICAgICAgICAgICAgYXV0aEludGVycnVwdHM6IEJvb2xlYW4obmV4dENvbmZpZy5leHBlcmltZW50YWwuYXV0aEludGVycnVwdHMpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VwcG9ydHNEeW5hbWljUmVzcG9uc2UsXG4gICAgICAgICAgICBpbmNyZW1lbnRhbENhY2hlOiBnZXRSZXF1ZXN0TWV0YShyZXEsICdpbmNyZW1lbnRhbENhY2hlJyksXG4gICAgICAgICAgICBjYWNoZUxpZmVQcm9maWxlczogKF9uZXh0Q29uZmlnX2V4cGVyaW1lbnRhbCA9IG5leHRDb25maWcuZXhwZXJpbWVudGFsKSA9PSBudWxsID8gdm9pZCAwIDogX25leHRDb25maWdfZXhwZXJpbWVudGFsLmNhY2hlTGlmZSxcbiAgICAgICAgICAgIGlzUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgIHdhaXRVbnRpbDogY3R4LndhaXRVbnRpbCxcbiAgICAgICAgICAgIG9uQ2xvc2U6IChjYik9PntcbiAgICAgICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2IpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uQWZ0ZXJUYXNrRXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG9uSW5zdHJ1bWVudGF0aW9uUmVxdWVzdEVycm9yOiAoZXJyb3IsIF9yZXF1ZXN0LCBlcnJvckNvbnRleHQpPT5yb3V0ZU1vZHVsZS5vblJlcXVlc3RFcnJvcihyZXEsIGVycm9yLCBlcnJvckNvbnRleHQsIHJvdXRlclNlcnZlckNvbnRleHQpXG4gICAgICAgIH0sXG4gICAgICAgIHNoYXJlZENvbnRleHQ6IHtcbiAgICAgICAgICAgIGJ1aWxkSWRcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3Qgbm9kZU5leHRSZXEgPSBuZXcgTm9kZU5leHRSZXF1ZXN0KHJlcSk7XG4gICAgY29uc3Qgbm9kZU5leHRSZXMgPSBuZXcgTm9kZU5leHRSZXNwb25zZShyZXMpO1xuICAgIGNvbnN0IG5leHRSZXEgPSBOZXh0UmVxdWVzdEFkYXB0ZXIuZnJvbU5vZGVOZXh0UmVxdWVzdChub2RlTmV4dFJlcSwgc2lnbmFsRnJvbU5vZGVSZXNwb25zZShyZXMpKTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBpbnZva2VSb3V0ZU1vZHVsZSA9IGFzeW5jIChzcGFuKT0+e1xuICAgICAgICAgICAgcmV0dXJuIHJvdXRlTW9kdWxlLmhhbmRsZShuZXh0UmVxLCBjb250ZXh0KS5maW5hbGx5KCgpPT57XG4gICAgICAgICAgICAgICAgaWYgKCFzcGFuKSByZXR1cm47XG4gICAgICAgICAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2h0dHAuc3RhdHVzX2NvZGUnOiByZXMuc3RhdHVzQ29kZSxcbiAgICAgICAgICAgICAgICAgICAgJ25leHQucnNjJzogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCByb290U3BhbkF0dHJpYnV0ZXMgPSB0cmFjZXIuZ2V0Um9vdFNwYW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgICAgICAgICAgLy8gV2Ugd2VyZSB1bmFibGUgdG8gZ2V0IGF0dHJpYnV0ZXMsIHByb2JhYmx5IE9URUwgaXMgbm90IGVuYWJsZWRcbiAgICAgICAgICAgICAgICBpZiAoIXJvb3RTcGFuQXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyb290U3BhbkF0dHJpYnV0ZXMuZ2V0KCduZXh0LnNwYW5fdHlwZScpICE9PSBCYXNlU2VydmVyU3Bhbi5oYW5kbGVSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5leHBlY3RlZCByb290IHNwYW4gdHlwZSAnJHtyb290U3BhbkF0dHJpYnV0ZXMuZ2V0KCduZXh0LnNwYW5fdHlwZScpfScuIFBsZWFzZSByZXBvcnQgdGhpcyBOZXh0LmpzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS92ZXJjZWwvbmV4dC5qc2ApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlID0gcm9vdFNwYW5BdHRyaWJ1dGVzLmdldCgnbmV4dC5yb3V0ZScpO1xuICAgICAgICAgICAgICAgIGlmIChyb3V0ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYCR7bWV0aG9kfSAke3JvdXRlfWA7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4uc2V0QXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnbmV4dC5yb3V0ZSc6IHJvdXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2h0dHAucm91dGUnOiByb3V0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICduZXh0LnNwYW5fbmFtZSc6IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4udXBkYXRlTmFtZShuYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzcGFuLnVwZGF0ZU5hbWUoYCR7bWV0aG9kfSAke3JlcS51cmx9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGhhbmRsZVJlc3BvbnNlID0gYXN5bmMgKGN1cnJlbnRTcGFuKT0+e1xuICAgICAgICAgICAgdmFyIF9jYWNoZUVudHJ5X3ZhbHVlO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VHZW5lcmF0b3IgPSBhc3luYyAoeyBwcmV2aW91c0NhY2hlRW50cnkgfSk9PntcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWdldFJlcXVlc3RNZXRhKHJlcSwgJ21pbmltYWxNb2RlJykgJiYgaXNPbkRlbWFuZFJldmFsaWRhdGUgJiYgcmV2YWxpZGF0ZU9ubHlHZW5lcmF0ZWQgJiYgIXByZXZpb3VzQ2FjaGVFbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvbi1kZW1hbmQgcmV2YWxpZGF0ZSBhbHdheXMgc2V0cyB0aGlzIGhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcigneC1uZXh0anMtY2FjaGUnLCAnUkVWQUxJREFURUQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoJ1RoaXMgcGFnZSBjb3VsZCBub3QgYmUgZm91bmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW52b2tlUm91dGVNb2R1bGUoY3VycmVudFNwYW4pO1xuICAgICAgICAgICAgICAgICAgICByZXEuZmV0Y2hNZXRyaWNzID0gY29udGV4dC5yZW5kZXJPcHRzLmZldGNoTWV0cmljcztcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBlbmRpbmdXYWl0VW50aWwgPSBjb250ZXh0LnJlbmRlck9wdHMucGVuZGluZ1dhaXRVbnRpbDtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXR0ZW1wdCB1c2luZyBwcm92aWRlZCB3YWl0VW50aWwgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0J3Mgbm90IHdlIGZhbGxiYWNrIHRvIHNlbmRSZXNwb25zZSdzIGhhbmRsaW5nXG4gICAgICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nV2FpdFVudGlsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3R4LndhaXRVbnRpbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC53YWl0VW50aWwocGVuZGluZ1dhaXRVbnRpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVuZGluZ1dhaXRVbnRpbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWNoZVRhZ3MgPSBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkVGFncztcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJlcXVlc3QgaXMgZm9yIGEgc3RhdGljIHJlc3BvbnNlLCB3ZSBjYW4gY2FjaGUgaXQgc28gbG9uZ1xuICAgICAgICAgICAgICAgICAgICAvLyBhcyBpdCdzIG5vdCBlZGdlLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJc3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBhd2FpdCByZXNwb25zZS5ibG9iKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBoZWFkZXJzIGZyb20gdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IHRvTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMocmVzcG9uc2UuaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1tORVhUX0NBQ0hFX1RBR1NfSEVBREVSXSA9IGNhY2hlVGFncztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGVhZGVyc1snY29udGVudC10eXBlJ10gJiYgYmxvYi50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1snY29udGVudC10eXBlJ10gPSBibG9iLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXZhbGlkYXRlID0gdHlwZW9mIGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRSZXZhbGlkYXRlID09PSAndW5kZWZpbmVkJyB8fCBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkUmV2YWxpZGF0ZSA+PSBJTkZJTklURV9DQUNIRSA/IGZhbHNlIDogY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZFJldmFsaWRhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBpcmUgPSB0eXBlb2YgY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZEV4cGlyZSA9PT0gJ3VuZGVmaW5lZCcgfHwgY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZEV4cGlyZSA+PSBJTkZJTklURV9DQUNIRSA/IHVuZGVmaW5lZCA6IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRFeHBpcmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNhY2hlIGVudHJ5IGZvciB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWNoZUVudHJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6IENhY2hlZFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBCdWZmZXIuZnJvbShhd2FpdCBibG9iLmFycmF5QnVmZmVyKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZUNvbnRyb2w6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwaXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZUVudHJ5O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCByZXNwb25zZSB3aXRob3V0IGNhY2hpbmcgaWYgbm90IElTUlxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgc2VuZFJlc3BvbnNlKG5vZGVOZXh0UmVxLCBub2RlTmV4dFJlcywgcmVzcG9uc2UsIGNvbnRleHQucmVuZGVyT3B0cy5wZW5kaW5nV2FpdFVudGlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYSBiYWNrZ3JvdW5kIHJldmFsaWRhdGUgd2UgbmVlZCB0byByZXBvcnRcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlcXVlc3QgZXJyb3IgaGVyZSBhcyBpdCB3b24ndCBiZSBidWJibGVkXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c0NhY2hlRW50cnkgPT0gbnVsbCA/IHZvaWQgMCA6IHByZXZpb3VzQ2FjaGVFbnRyeS5pc1N0YWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByb3V0ZU1vZHVsZS5vblJlcXVlc3RFcnJvcihyZXEsIGVyciwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlcktpbmQ6ICdBcHAgUm91dGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZVBhdGg6IHNyY1BhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVUeXBlOiAncm91dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmFsaWRhdGVSZWFzb246IGdldFJldmFsaWRhdGVSZWFzb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1JldmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT25EZW1hbmRSZXZhbGlkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJvdXRlclNlcnZlckNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgY2FjaGVFbnRyeSA9IGF3YWl0IHJvdXRlTW9kdWxlLmhhbmRsZVJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICByZXEsXG4gICAgICAgICAgICAgICAgbmV4dENvbmZpZyxcbiAgICAgICAgICAgICAgICBjYWNoZUtleSxcbiAgICAgICAgICAgICAgICByb3V0ZUtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgICAgICAgICAgaXNGYWxsYmFjazogZmFsc2UsXG4gICAgICAgICAgICAgICAgcHJlcmVuZGVyTWFuaWZlc3QsXG4gICAgICAgICAgICAgICAgaXNSb3V0ZVBQUkVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzT25EZW1hbmRSZXZhbGlkYXRlLFxuICAgICAgICAgICAgICAgIHJldmFsaWRhdGVPbmx5R2VuZXJhdGVkLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlR2VuZXJhdG9yLFxuICAgICAgICAgICAgICAgIHdhaXRVbnRpbDogY3R4LndhaXRVbnRpbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBjcmVhdGUgYSBjYWNoZUVudHJ5IGZvciBJU1JcbiAgICAgICAgICAgIGlmICghaXNJc3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoY2FjaGVFbnRyeSA9PSBudWxsID8gdm9pZCAwIDogKF9jYWNoZUVudHJ5X3ZhbHVlID0gY2FjaGVFbnRyeS52YWx1ZSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9jYWNoZUVudHJ5X3ZhbHVlLmtpbmQpICE9PSBDYWNoZWRSb3V0ZUtpbmQuQVBQX1JPVVRFKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9jYWNoZUVudHJ5X3ZhbHVlMTtcbiAgICAgICAgICAgICAgICB0aHJvdyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3IEVycm9yKGBJbnZhcmlhbnQ6IGFwcC1yb3V0ZSByZWNlaXZlZCBpbnZhbGlkIGNhY2hlIGVudHJ5ICR7Y2FjaGVFbnRyeSA9PSBudWxsID8gdm9pZCAwIDogKF9jYWNoZUVudHJ5X3ZhbHVlMSA9IGNhY2hlRW50cnkudmFsdWUpID09IG51bGwgPyB2b2lkIDAgOiBfY2FjaGVFbnRyeV92YWx1ZTEua2luZH1gKSwgXCJfX05FWFRfRVJST1JfQ09ERVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkU3MDFcIixcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFnZXRSZXF1ZXN0TWV0YShyZXEsICdtaW5pbWFsTW9kZScpKSB7XG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcigneC1uZXh0anMtY2FjaGUnLCBpc09uRGVtYW5kUmV2YWxpZGF0ZSA/ICdSRVZBTElEQVRFRCcgOiBjYWNoZUVudHJ5LmlzTWlzcyA/ICdNSVNTJyA6IGNhY2hlRW50cnkuaXNTdGFsZSA/ICdTVEFMRScgOiAnSElUJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEcmFmdCBtb2RlIHNob3VsZCBuZXZlciBiZSBjYWNoZWRcbiAgICAgICAgICAgIGlmIChpc0RyYWZ0TW9kZSkge1xuICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAncHJpdmF0ZSwgbm8tY2FjaGUsIG5vLXN0b3JlLCBtYXgtYWdlPTAsIG11c3QtcmV2YWxpZGF0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IGZyb21Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyhjYWNoZUVudHJ5LnZhbHVlLmhlYWRlcnMpO1xuICAgICAgICAgICAgaWYgKCEoZ2V0UmVxdWVzdE1ldGEocmVxLCAnbWluaW1hbE1vZGUnKSAmJiBpc0lzcikpIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLmRlbGV0ZShORVhUX0NBQ0hFX1RBR1NfSEVBREVSKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIGNhY2hlIGNvbnRyb2wgaXMgYWxyZWFkeSBzZXQgb24gdGhlIHJlc3BvbnNlIHdlIGRvbid0XG4gICAgICAgICAgICAvLyBvdmVycmlkZSBpdCB0byBhbGxvdyB1c2VycyB0byBjdXN0b21pemUgaXQgdmlhIG5leHQuY29uZmlnXG4gICAgICAgICAgICBpZiAoY2FjaGVFbnRyeS5jYWNoZUNvbnRyb2wgJiYgIXJlcy5nZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnKSAmJiAhaGVhZGVycy5nZXQoJ0NhY2hlLUNvbnRyb2wnKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDYWNoZS1Db250cm9sJywgZ2V0Q2FjaGVDb250cm9sSGVhZGVyKGNhY2hlRW50cnkuY2FjaGVDb250cm9sKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCBzZW5kUmVzcG9uc2Uobm9kZU5leHRSZXEsIG5vZGVOZXh0UmVzLCBuZXcgUmVzcG9uc2UoY2FjaGVFbnRyeS52YWx1ZS5ib2R5LCB7XG4gICAgICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IGNhY2hlRW50cnkudmFsdWUuc3RhdHVzIHx8IDIwMFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIC8vIFRPRE86IGFjdGl2ZVNwYW4gY29kZSBwYXRoIGlzIGZvciB3aGVuIHdyYXBwZWQgYnlcbiAgICAgICAgLy8gbmV4dC1zZXJ2ZXIgY2FuIGJlIHJlbW92ZWQgd2hlbiB0aGlzIGlzIG5vIGxvbmdlciB1c2VkXG4gICAgICAgIGlmIChhY3RpdmVTcGFuKSB7XG4gICAgICAgICAgICBhd2FpdCBoYW5kbGVSZXNwb25zZShhY3RpdmVTcGFuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IHRyYWNlci53aXRoUHJvcGFnYXRlZENvbnRleHQocmVxLmhlYWRlcnMsICgpPT50cmFjZXIudHJhY2UoQmFzZVNlcnZlclNwYW4uaGFuZGxlUmVxdWVzdCwge1xuICAgICAgICAgICAgICAgICAgICBzcGFuTmFtZTogYCR7bWV0aG9kfSAke3JlcS51cmx9YCxcbiAgICAgICAgICAgICAgICAgICAga2luZDogU3BhbktpbmQuU0VSVkVSLFxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cC5tZXRob2QnOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cC50YXJnZXQnOiByZXEudXJsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBoYW5kbGVSZXNwb25zZSkpO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIGlmIHdlIGFyZW4ndCB3cmFwcGVkIGJ5IGJhc2Utc2VydmVyIGhhbmRsZSBoZXJlXG4gICAgICAgIGlmICghYWN0aXZlU3BhbiAmJiAhKGVyciBpbnN0YW5jZW9mIE5vRmFsbGJhY2tFcnJvcikpIHtcbiAgICAgICAgICAgIGF3YWl0IHJvdXRlTW9kdWxlLm9uUmVxdWVzdEVycm9yKHJlcSwgZXJyLCB7XG4gICAgICAgICAgICAgICAgcm91dGVyS2luZDogJ0FwcCBSb3V0ZXInLFxuICAgICAgICAgICAgICAgIHJvdXRlUGF0aDogbm9ybWFsaXplZFNyY1BhZ2UsXG4gICAgICAgICAgICAgICAgcm91dGVUeXBlOiAncm91dGUnLFxuICAgICAgICAgICAgICAgIHJldmFsaWRhdGVSZWFzb246IGdldFJldmFsaWRhdGVSZWFzb24oe1xuICAgICAgICAgICAgICAgICAgICBpc1JldmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgICAgIGlzT25EZW1hbmRSZXZhbGlkYXRlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldGhyb3cgc28gdGhhdCB3ZSBjYW4gaGFuZGxlIHNlcnZpbmcgZXJyb3IgcGFnZVxuICAgICAgICAvLyBJZiB0aGlzIGlzIGR1cmluZyBzdGF0aWMgZ2VuZXJhdGlvbiwgdGhyb3cgdGhlIGVycm9yIGFnYWluLlxuICAgICAgICBpZiAoaXNJc3IpIHRocm93IGVycjtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzZW5kIGEgNTAwIHJlc3BvbnNlLlxuICAgICAgICBhd2FpdCBzZW5kUmVzcG9uc2Uobm9kZU5leHRSZXEsIG5vZGVOZXh0UmVzLCBuZXcgUmVzcG9uc2UobnVsbCwge1xuICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&page=%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute.ts&appDir=C%3A%5Cdev%5Cprj%5Csmart-calendar%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cdev%5Cprj%5Csmart-calendar&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./types.ts":
/*!******************!*\
  !*** ./types.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TaskStatus: () => (/* binding */ TaskStatus)\n/* harmony export */ });\nvar TaskStatus = /*#__PURE__*/ function(TaskStatus) {\n    TaskStatus[\"ToDo\"] = \"ToDo\";\n    TaskStatus[\"InProgress\"] = \"InProgress\";\n    TaskStatus[\"Done\"] = \"Done\";\n    return TaskStatus;\n}({});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi90eXBlcy50cyIsIm1hcHBpbmdzIjoiOzs7O0FBa0JPLHdDQUFLQTs7OztXQUFBQTtNQUlYIiwic291cmNlcyI6WyJDOlxcZGV2XFxwcmpcXHNtYXJ0LWNhbGVuZGFyXFx0eXBlcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBpbnRlcmZhY2UgVXNlciB7XG4gIG5hbWU6IHN0cmluZztcbiAgYXZhdGFyVXJsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3ViQ2F0ZWdvcnkge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2F0ZWdvcnkge1xuICBpZDpzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgY29sb3I6IHN0cmluZztcbiAgc3ViQ2F0ZWdvcmllczogU3ViQ2F0ZWdvcnlbXTtcbn1cblxuZXhwb3J0IGVudW0gVGFza1N0YXR1cyB7XG4gIFRvRG8gPSAnVG9EbycsXG4gIEluUHJvZ3Jlc3MgPSAnSW5Qcm9ncmVzcycsXG4gIERvbmUgPSAnRG9uZScsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbWVudCB7XG4gIGlkOiBzdHJpbmc7XG4gIGF1dGhvcjogc3RyaW5nO1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGNyZWF0ZWRBdDogc3RyaW5nOyAvLyBJU08gRGF0ZSBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUYXNrIHtcbiAgaWQ6IHN0cmluZztcbiAgY29udGVudDogc3RyaW5nO1xuICBzdGF0dXM6IFRhc2tTdGF0dXM7XG4gIGNvbW1lbnRzOiBDb21tZW50W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGFza1RlbXBsYXRlIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmVudCB7XG4gIGlkOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGRhdGU6IHN0cmluZzsgLy8gWVlZWS1NTS1ERFxuICBzdGFydFRpbWU6IHN0cmluZzsgLy8gSEg6bW1cbiAgZW5kVGltZTogc3RyaW5nOyAvLyBISDptbVxuICBjYXRlZ29yeUlkOiBzdHJpbmc7XG4gIHN1YkNhdGVnb3J5SWQ/OiBzdHJpbmc7XG59Il0sIm5hbWVzIjpbIlRhc2tTdGF0dXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./types.ts\n");

/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "next/dist/shared/lib/no-fallback-error.external":
/*!******************************************************************!*\
  !*** external "next/dist/shared/lib/no-fallback-error.external" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/no-fallback-error.external");

/***/ }),

/***/ "next/dist/shared/lib/router/utils/app-paths":
/*!**************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/app-paths" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/app-paths");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:https");

/***/ }),

/***/ "node:net":
/*!***************************!*\
  !*** external "node:net" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:net");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0","vendor-chunks/google-auth-library@10.2.0","vendor-chunks/bignumber.js@9.3.1","vendor-chunks/gaxios@7.1.1","vendor-chunks/json-bigint@1.0.0","vendor-chunks/gtoken@8.0.0","vendor-chunks/google-logging-utils@1.1.1","vendor-chunks/gcp-metadata@7.0.1","vendor-chunks/jws@4.0.0","vendor-chunks/jwa@2.0.1","vendor-chunks/ecdsa-sig-formatter@1.0.11","vendor-chunks/base64-js@1.5.1","vendor-chunks/extend@3.0.2","vendor-chunks/safe-buffer@5.2.1","vendor-chunks/buffer-equal-constant-time@1.0.1"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.4.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&page=%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fgoogle%2Fcallback%2Froute.ts&appDir=C%3A%5Cdev%5Cprj%5Csmart-calendar%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cdev%5Cprj%5Csmart-calendar&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!")));
module.exports = __webpack_exports__;

})();