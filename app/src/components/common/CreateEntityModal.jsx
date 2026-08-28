import { X } from 'lucide-react';
import '../career-paths/HowItWorksModal.css';
import './CreateEntityModal.css';

// Generic modal shell for "create new X" forms across pages (Experiments, Paths, etc).
// Reuses .modal-overlay / .modal-content / .modal-title / .modal-close-btn from
// HowItWorksModal.css so visual chrome stays consistent across every modal in the app.
// Field-specific logic (state, validation, Supabase insert) lives in the caller,
// this component only renders the shell + submit button.
function CreateEntityModal({ title, onClose, onSubmit, submitLabel = 'Simpan', isSubmitting, error, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} type="button">
          <X size={20} />
        </button>

        <h2 className="modal-title">{title}</h2>

        <form className="entity-form" onSubmit={onSubmit}>
          {children}

          {error && <p className="entity-form-error">{error}</p>}

          <button type="submit" className="modal-got-it-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEntityModal;