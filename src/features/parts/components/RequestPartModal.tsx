"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { searchParts, createPartRequest } from "@/api/parts";
import { Part } from "@/types/parts";
import { useDebounce } from "@/hooks/useDebounce";

interface RequestPartModalProps {
  workOrderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RequestPartModal({
  workOrderId,
  isOpen,
  onClose,
  onSuccess,
}: RequestPartModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Search parts when query changes
  useEffect(() => {
    if (debouncedSearch) {
      setIsSearching(true);
      searchParts(debouncedSearch, 1, 10)
        .then((response) => setSearchResults(response.data))
        .catch((err) => setError(err.message))
        .finally(() => setIsSearching(false));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPart || !quantity) return;

    setIsSubmitting(true);
    setError("");

    try {
      await createPartRequest(workOrderId, {
        part_id: selectedPart.id,
        quantity: parseFloat(quantity),
        notes,
      });
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedPart(null);
    setQuantity("");
    setNotes("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Request Part</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Parts */}
          <div>
            <Label htmlFor="search">Search Parts</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name, SKU, or part number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />

            {/* Search Results */}
            {isSearching && (
              <div className="mt-2 text-sm text-gray-500">Searching...</div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto border rounded-lg divide-y">
                {searchResults.map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => {
                      setSelectedPart(part);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {part.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {part.part_number} • {part.brand || "No brand"}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            part.quantity > part.min_quantity
                              ? "bg-green-100 text-green-800"
                              : part.quantity > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          Stock: {part.quantity}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Part */}
          {selectedPart && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-900">
                    {selectedPart.name}
                  </div>
                  <div className="text-sm text-blue-700">
                    SKU: {selectedPart.part_number}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPart(null)}
                >
                  Change
                </Button>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedPart || !quantity || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? "Requesting..." : "Request Part"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
