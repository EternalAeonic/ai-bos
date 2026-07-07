export class DomainException extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "DomainException";
  }
}

export class InvalidQuantityException extends DomainException {
  constructor(message: string = "Quantity must be greater than zero") {
    super("INVALID_QUANTITY", message);
  }
}

export class JournalNotBalancedException extends DomainException {
  constructor(message: string = "Journal entry debits and credits do not balance") {
    super("JOURNAL_NOT_BALANCED", message);
  }
}

export class SupplierNotFoundException extends DomainException {
  constructor(message: string = "Supplier does not exist") {
    super("SUPPLIER_NOT_FOUND", message);
  }
}

export class DepartmentNotFoundException extends DomainException {
  constructor(message: string = "Department does not exist") {
    super("DEPARTMENT_NOT_FOUND", message);
  }
}

export class AccessDeniedException extends DomainException {
  constructor(message: string = "Tenant isolation violation") {
    super("ACCESS_DENIED", message);
  }
}
