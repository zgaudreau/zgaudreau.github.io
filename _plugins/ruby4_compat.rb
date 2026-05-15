# String#tainted? was removed in Ruby 3.2; Liquid 4.x still calls it.
# Restore it as a no-op that always returns false (its pre-removal behavior).
unless "".respond_to?(:tainted?)
  class String
    def tainted?
      false
    end
  end
end
