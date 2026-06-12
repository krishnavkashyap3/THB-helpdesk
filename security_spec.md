# Security Specification & Hardening (TDD Spec)

## 1. Data Invariants
- A student document `/students/{studentId}` belongs strictly to the user matching `request.auth.uid`.
- Users can write (create/update) only their own document.
- Users cannot change their established email once registered (email is immutable, or tied strictly to auth token).
- Any registered email in `/students/{studentId}` must exactly match the `request.auth.token.email`.
- Inputs like name, rollNumber, semester, and departmentId must be well-formed strings with sensible bounds.

## 2. The "Dirty Dozen" Payloads (Deny Scenarios)
1. Write to another user's student document `/students/malicious_user` as `innocent_user`.
2. Register a student document where `email` is set to someone else's email address (mismatch with `request.auth.token.email`).
3. Set user's own major `departmentId` value containing a 50KB string of junk characters.
4. Set `rollNumber` with a 1MB string (Buffer Overflow payload).
5. Set `semester` to an empty string on create.
6. Trigger a write call without being signed in (anonymous/unauthenticated).
7. Execute an `allow list` query over `/students` without filtering by `request.auth.uid` to read all students' PII.
8. Set isVerified orisAdmin fields to spoof roles (Ghost Fields).
9. Attempt an update where the user attempts to swap `email` string to another domain post-registration.
10. Send a payload that leaves out required fields (e.g. `rollNumber` or `semester`) on document creation.
11. Inject malicious characters (SQL/noSQL syntax) into `studentId`.
12. Modify historical immutable identifiers such as `createdAt`.

## 3. Test Runner Schema (Draft rules of enforcement)
The tests verify that each of the forbidden cases is rejected at the Firebase Engine layer.
