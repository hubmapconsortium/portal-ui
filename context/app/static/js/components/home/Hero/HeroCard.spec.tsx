import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import BubbleChartRoundedIcon from '@mui/icons-material/BubbleChartRounded';
import { trackEvent } from 'js/helpers/trackers';
import HeroCard from './HeroCard';

const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;

const baseProps = {
  icon: BubbleChartRoundedIcon,
  title: 'Organs',
  description: 'Browse data organized by human organ systems.',
  href: '/organs',
};

describe('HeroCard', () => {
  it('renders the title and description', () => {
    render(<HeroCard {...baseProps} />);
    expect(screen.getByText('Organs')).toBeInTheDocument();
    expect(screen.getByText('Browse data organized by human organ systems.')).toBeInTheDocument();
  });

  it('renders as a link with the correct href', () => {
    render(<HeroCard {...baseProps} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/organs');
  });

  it('renders thumbnail picture with CDN urls when thumbnailName is provided', () => {
    render(<HeroCard {...baseProps} thumbnailName="organ" />);
    const source = document.querySelector('source[type="image/webp"]') as HTMLSourceElement;
    expect(source.srcset).toContain('thumbnail_organ-25.webp');
    const img = document.querySelector('picture img') as HTMLImageElement;
    expect(img.src).toContain('thumbnail_organ-25.png');
  });

  it('renders a video element when videoSrc is provided', () => {
    render(<HeroCard {...baseProps} videoSrc="http://example.com/video.mp4" />);
    expect(document.querySelector('video')).toBeInTheDocument();
  });

  it('renders no media when neither thumbnailName nor videoSrc is provided', () => {
    render(<HeroCard {...baseProps} />);
    expect(document.querySelector('picture')).not.toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });

  it('fires trackEvent with correct args on click', () => {
    render(<HeroCard {...baseProps} />);
    fireEvent.click(screen.getByRole('link'));
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Homepage',
      action: 'Hero Card / Organs',
    });
  });

  it('calls onCardHover when the mouse enters the card', () => {
    const onCardHover = jest.fn();
    render(<HeroCard {...baseProps} onCardHover={onCardHover} />);
    fireEvent.mouseEnter(screen.getByRole('link'));
    expect(onCardHover).toHaveBeenCalledTimes(1);
  });

  it('calls onCardHoverEnd when the mouse leaves the card', () => {
    const onCardHoverEnd = jest.fn();
    render(<HeroCard {...baseProps} onCardHoverEnd={onCardHoverEnd} />);
    fireEvent.mouseLeave(screen.getByRole('link'));
    expect(onCardHoverEnd).toHaveBeenCalledTimes(1);
  });
});
