# Current Sprint Tasks

The focus of this first sprint is to lay the foundational infrastructure: 
user authentication and core API modules. The **first functional feature** 
of the platform will be **appointment scheduling**, which depends on 
successful authentication. All subsequent modules (timeline, signature, 
legal API integration) build upon this base.

---

## USER-001: Implement User Authentication
Status: In Progress  
Priority: High  
Dependencies: None

### Requirements
- [x] Email/password authentication
- [x] JWT token generation
- [x] Password hashing with bcrypt
- [ ] Rate limiting on login attempts

### Acceptance Criteria
1. [x] Users can register with email/password
2. [x] Users receive JWT on successful login
3. [x] Passwords are securely hashed
4. [ ] Failed login attempts are rate limited

### Technical Notes
- [x] Use @nestjs/jwt for token management
- [ ] Implement rate limiting using Redis
- [x] Follow authentication patterns from `technical.md`

---

## APPT-001: Implement Appointment Scheduling (First Functional Feature)
Status: In Progress  
Priority: High  
Dependencies: USER-001 (Authentication)

### Requirements
- [x] Users can book appointments (visio or in-person)
- [x] Appointments are associated with notarial staff
- [x] Ability to cancel or reschedule

### Acceptance Criteria
1. [x] Authenticated users can access a scheduling interface
2. [x] Appointments are stored in the database and linked to user and notary
3. [x] Timeslots reflect staff availability (hardcoded or config-based for MVP)
4. [ ] User and staff receive confirmation via email (mock or real)

### Technical Notes
- [x] Use `Appointment` entity from `technical.md`
- [x] Add basic availability config for now (cron/slots can be hardcoded)
- [ ] Later sprints will handle ICS calendar sync and real-time availability

---

## SIGN-001: Implement Signature Request Service
Status: Not Started  
Priority: High  
Dependencies: USER-001 (Authentication)

### Requirements
- [ ] Interface with RGS-compliant signature provider (e.g., ADSN or Docaposte)
- [ ] Accept a document ID and user ID to request a signature
- [ ] Return a URL or token to initiate signature
- [ ] Handle asynchronous confirmation of signature status

### Acceptance Criteria
1. [ ] A document can be sent to the signature provider via API
2. [ ] The client receives a redirect link or token to complete the signature
3. [ ] Signature status can be retrieved and updated in the system
4. [ ] The signature request is traceable and linked to an audit log

### Technical Notes
- [ ] Use Axios to connect with external signature providers
- [ ] Ensure secure storage of signature requests
- [ ] Log all interactions with external providers
- [ ] Use event bus to notify modules of signature completion
- [ ] Refer to `SignatureService` in `technical.md`

---

## API-EXT-002: Integrate MICEN API
Status: Not Started  
Priority: Medium  
Dependencies: CASE-002 (Timeline Management)

### Requirements
- [ ] Send act metadata to MICEN for compliance
- [ ] Store MICEN reference code in case file
- [ ] Handle failed submission retries

### Acceptance Criteria
1. [ ] Act metadata is correctly formatted and submitted to MICEN
2. [ ] A MICEN reference is returned and stored in the database
3. [ ] The timeline updates when the MICEN step is completed

### Technical Notes
- [ ] Use NotarialApiService stub from `technical.md`
- [ ] Add unit tests with mocked MICEN responses
- [ ] Store MICEN references in `CaseTimeline`
