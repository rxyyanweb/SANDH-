import React, { useState } from 'react';
import { X, Star, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const ReviewModal: React.FC = () => {
  const { reviewingOrder, setReviewingOrder, submitReview } = useRestaurant();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>(reviewingOrder?.customerName || '');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!reviewingOrder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!authorName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!comment.trim()) {
      setErrorMessage('Please provide your review feedback.');
      return;
    }

    const success = submitReview(
      reviewingOrder.orderNumber,
      rating,
      comment.trim(),
      authorName.trim()
    );

    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setReviewingOrder(null);
      }, 1500);
    } else {
      setErrorMessage('Unable to submit review. Orders must be marked completed first.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overscroll-contain">
      <div
        className="relative w-full max-w-lg max-h-[88dvh] sm:max-h-[90dvh] flex flex-col bg-white dark:bg-[#121419] border border-gray-200 dark:border-[#272b38] rounded-2xl shadow-2xl overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        {/* Fixed Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[#1f232d] flex items-center justify-between bg-white dark:bg-[#121419] shrink-0">
          <div>
            <h2 id="review-modal-title" className="text-lg sm:text-xl font-serif font-bold text-gray-900 dark:text-[#fbf7ee]">
              Leave a Review
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#8690a0]">
              Verified review for Order #{reviewingOrder.orderNumber}
            </p>
          </div>
          <button
            onClick={() => setReviewingOrder(null)}
            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-[#f4efe6] hover:bg-gray-100 dark:hover:bg-[#1a1d26] rounded-lg transition-colors cursor-pointer"
            aria-label="Close review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-[#fbf7ee]">
                Review Submitted!
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#8b95a6]">
                Thank you for your feedback. Your review is now published on our website.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-[#8b95a6] block">
                  Overall Rating
                </label>
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviewer Name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-[#cbd4e2]">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rayyan Khan"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161821] border border-gray-300 dark:border-[#2a2f3f] rounded-xl text-xs sm:text-sm text-gray-900 dark:text-[#f4efe6] focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-[#cbd4e2]">
                  Your Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your dining experience with Sandh Restaurant..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161821] border border-gray-300 dark:border-[#2a2f3f] rounded-xl text-xs sm:text-sm text-gray-900 dark:text-[#f4efe6] focus:outline-none focus:border-amber-500 resize-none"
                  maxLength={300}
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-gray-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Submit Verified Review
              </button>
            </form>
          )}
        </div>

        {/* Fixed Sticky Footer */}
        <div className="p-3 bg-gray-50 dark:bg-[#141720] border-t border-gray-200 dark:border-[#1f232d] shrink-0 flex items-center justify-end">
          <button
            onClick={() => setReviewingOrder(null)}
            className="px-4 py-1.5 text-xs text-gray-600 dark:text-[#8e98aa] hover:text-gray-900 dark:hover:text-[#f4efe6] font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
