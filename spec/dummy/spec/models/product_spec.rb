require 'rails_helper'

RSpec.describe Product, :type => :model do
  let(:product) { create(:product) }
  let(:file_io) { StringIO.new("") }
  let(:path)       { "path/phone6+ copy (1).jpg" }
  let(:other_path) { "path/other.jpg" }
  let(:attache_response) { Hash(path: path).to_json }
  let(:attache_fail) { Hash(bad: path).to_json }
  let(:other_attache_response) { Hash(path: other_path).to_json }
  let(:expected_attr_with_geometry) { {"path"=>path, "url"=>"http://localhost:9292/view/path/geometry/phone6%2B+copy+%281%29.jpg"} }

  context 'has_one_attache' do

    it { expect(product.hero_image).to eq(nil) }
    it { expect(product.hero_image_options('geometry')).to eq({
        multiple: false,
        class: "enable-attache",
        data: {
          geometry: "geometry",
          value: [],
          placeholder: [],
          uploadurl: "http://localhost:9292/upload",
          downloadurl: "http://localhost:9292/view",
        }
      })
    }

    describe 'hero_image=' do
      it { expect { product.update(hero_image: attache_response) }.to change { product.hero_image }.to eq(JSON.parse(attache_response)) }
      it { expect { product.update(hero_image: "")               }.not_to change { product.hero_image } }
      it { expect { product.update(hero_image: nil)              }.not_to change { product.hero_image } }
      it { expect { product.update(hero_image: attache_fail)     }.not_to change { product.hero_image } }

      context 'accepts IO object' do
        before do
          expect(Attache::API::V1).to receive(:attache_auth_options).and_return({})
          allow(HTTPClient).to receive(:post).and_return(double(:response, body: attache_response))
        end

        it { expect { product.update(hero_image: file_io) }.to change { product.hero_image }.to eq(JSON.parse(attache_response)) }
      end
    end

    context 'with value' do
      let(:product) { create(:product, hero_image: attache_response) }

      it { expect(product.hero_image_attributes('geometry')).to eq(expected_attr_with_geometry) }
      it { expect(product.hero_image_url("geometry")).to eq(expected_attr_with_geometry['url']) }
      it { expect(product.hero_image_options('geometry')).to eq({
          multiple: false,
          class: "enable-attache",
          data: {
            geometry: "geometry",
            value: [expected_attr_with_geometry],
            placeholder: [],
            uploadurl: "http://localhost:9292/upload",
            downloadurl: "http://localhost:9292/view",
          }
        })
      }

      context 'discarding old values with auth_options' do
        before do
          expect(Attache::API::V1).to receive(:attache_auth_options).and_return({})
          expect(HTTPClient).to receive(:post_content) do |target_url, params|
            expect(params).to eq(paths: path)
          end
        end

        it { product.update(hero_image: other_attache_response) }
        it { product.destroy }
      end

      context 'discarding new values with auth_options' do
        before do
          expect(Attache::API::V1).to receive(:attache_auth_options).and_return({})
          expect(HTTPClient).to receive(:post_content) do |target_url, params|
            expect(params).to eq(paths: other_path)
          end
        end

        it { product.update(attaches_discarded: [other_path]) }
      end
    end
  end

  context 'has_many_attaches' do

    it { expect(product.photos).to eq(nil) }
    it { expect(product.photos_options('geometry')).to eq({
        multiple: true,
        class: "enable-attache",
        data: {
          geometry: "geometry",
          value: [],
          placeholder: [],
          uploadurl: "http://localhost:9292/upload",
          downloadurl: "http://localhost:9292/view",
        }
      })
    }

    describe 'photos=' do
      it { expect { product.update(photos: [attache_response]) }.to change { product.photos }.to eq([JSON.parse(attache_response)]) }
      it { expect { product.update(photos: [""])               }.to change { product.photos }.to eq([]) }
      it { expect { product.update(photos: [nil])              }.to change { product.photos }.to eq([]) }
      it { expect { product.update(photos: [])                 }.to change { product.photos }.to eq([]) }
      it { expect { product.update(photos: "")                 }.to change { product.photos }.to eq([]) }
      it { expect { product.update(photos: nil)                }.to change { product.photos }.to eq([]) }
      it { expect { product.update(photos: [attache_fail])     }.to change { product.photos }.to eq([]) }

      context 'accepts IO object' do
        before do
          expect(Attache::API::V1).to receive(:attache_auth_options).and_return({})
          allow(HTTPClient).to receive(:post).and_return(double(:response, body: attache_response))
        end

        it { expect { product.update(photos: [file_io]) }.to change { product.photos }.to eq([JSON.parse(attache_response)]) }
      end
    end

    context 'with value' do
      let(:product) { create(:product, photos: [attache_response]) }

      it { expect(product.photos_attributes('geometry')).to eq([expected_attr_with_geometry]) }
      it { expect(product.photos_urls("geometry")).to eq([expected_attr_with_geometry['url']]) }
      it { expect(product.photos_options('geometry')).to eq({
          multiple: true,
          class: "enable-attache",
          data: {
            geometry: "geometry",
            value: [expected_attr_with_geometry],
            placeholder: [],
            uploadurl: "http://localhost:9292/upload",
            downloadurl: "http://localhost:9292/view",
          }
        })
      }

      context 'discarding old values with auth_options' do
        before do
          expect(HTTPClient).to receive(:post_content) do |target_url, params|
            expect(params).to eq(paths: path)
          end
        end

        it { product.update(photos: [other_attache_response]) }
        it { product.destroy }
      end

      context 'discarding new values with auth_options' do
        before do
          expect(HTTPClient).to receive(:post_content) do |target_url, params|
            expect(params).to eq(paths: other_path)
          end
        end

        it { product.update(attaches_discarded: [other_path]) }
      end
    end
  end
end
